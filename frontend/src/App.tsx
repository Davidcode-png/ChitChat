import React,{useState} from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import  useWebSocket,{ReadyState,SendMessage} from 'react-use-websocket';
import { read } from 'fs';
import Chat from './components/Chat';
import Navbar from './components/Navbar';
import Login from './components/Login';
import { AuthContextProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
 return (<div>
    <BrowserRouter>
      <Routes>
      <Route
          path="/"
          element={
            <AuthContextProvider>
              <Navbar />
            </AuthContextProvider>
          }
        />
        <Route path="/" element={<Navbar />}>
        <Route
          path="chats/:conversationName"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>

  </div>
)}
export default App;
