from channels.generic.websocket import JsonWebsocketConsumer
from .models import Conversation
from asgiref.sync import async_to_sync
class ChatConsumer(JsonWebsocketConsumer):
    """
    This consumer is used to show user's online status,
    and send notifications.
    """



    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.room_name = None
        self.user = None
        self.conversation_name = None
        self.conversation = None

    def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            return
        print("Connected")
        #Accepting the websocket connection
        self.accept()
        self.conversation_name = f"{self.scope['url_route']['kwargs']['conversation_name']}"
        self.conversation, created = Conversation.objects.get_or_create(name=self.conversation_name)
        # accepting group connection 
        # First changing it from async to sync because group_add is asynchronous
        async_to_sync(self.channel_layer.group_add)(
            self.conversation_name,
            self.channel_name,
        )
        #Sending the message after connection
        self.send_json(
           { 
            "type":"welcome_message",
            "message":"Hey there! You have succefully connected"
            }
        )

    
    def disconnect(self, code):
        print("Disconnected")
        return super().disconnect(code)
    
    def receive_json(self, content, **kwargs):
        # Gets the message type to get different response
        message_type = content["type"]
        if message_type == "greeting":
            print(content["message"])
            self.send_json({
                "type":"response",
                "message":"I'm good WBU"
            })
        
        # A group message
        if message_type == "chat_message":
            async_to_sync(self.channel_layer.group_send)(
                self.conversation_name,
                {
                    "type":"chat_message_echo",
                    "name":content["name"],
                    "message":content["message"]
                }
            )
        return super().receive_json(content, **kwargs)
    
    # The handler for the message type NB: The meesge type and the function name must be the 
    # same name
    def chat_message_echo(self, event):
        print(event)
        self.send_json(event)