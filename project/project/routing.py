from django.urls import path
from chat.channels import ChatConsumer

websocket_urlpatterns = [
    path("",ChatConsumer.as_asgi())
]

