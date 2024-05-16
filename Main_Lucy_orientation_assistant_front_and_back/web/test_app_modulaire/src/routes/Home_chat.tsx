/*
//MODIFICATION AVEC RENDRE INVISIBLE LE TITRE AU DÉBUT 
import React, { useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, TextField, IconButton, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import logo from '../logo_lucy.png';
import logo_greg from '../photo_greg.png';
import logo_ecole_penn from '../logo_penn.png';
import '../index.css';

import { ThreeDots } from 'react-loader-spinner';

import { AIMessage, HumanMessage } from '../components/Messages';
import { FeedbackType } from '../components/types';
import { ValidSources } from '../components/sources';
import { AnswerDocument } from '../interfaces/interfaces';

const theme = createTheme({
  palette: {
    primary: {
      main: '#EBE2FC',
    },
    secondary: {
      main: '#19857b',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          color: '#7C3BEC',
        },
      },
    },
  },
});

type Message = {
  id: number;
  type: 'human' | 'ai';
  content: string;
  personaName?: string;
  citedDocuments?: AnswerDocument[];
};

const HomeChat: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    setShowChat(true);
    setIsComplete(false);

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), type: 'human', content: inputValue },
    ]);

    setInputValue('');

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          type: 'ai',
          content: "How can I assist you with scheduling your meeting?",
          personaName: "Lucy",
          citedDocuments: [
            {
              document_id: "1",
              document_name: "Meeting Scheduling Guide",
              link: "https://example.com/meeting-scheduling-guide",
              source_type: "course_resource" as ValidSources,
            },
          ],
        },
      ]);
      setIsComplete(true);
    }, 5000);
  };

  const handleInputKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMeetingClick = () => {
    navigate('/schedule-meeting');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="relative p-4 bg-white flex items-center justify-between border-b border-gray-100">
          <img src={logo} alt="Lucy Logo" className="h-12 w-auto" />
          {showChat && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold text-custom-blue">
                Lucy Orientation Chatbot
              </h1>
            </div>
          )}
          <div style={{ flexGrow: 1 }}></div>
          <img src={logo_ecole_penn} alt="Another Logo" className="h-10 w-auto" style={{ marginRight: '10px' }} />
          <Button variant="outlined" color="primary" onClick={handleMeetingClick}>Book a meeting</Button>
        </div>
        {!showChat ? (
          <div className="flex-grow flex items-center justify-center w-full">
            <div className="w-full h-full p-8 bg-white flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-center mb-6 text-custom-blue">Lucy Orientation Chatbot</h1>
              <p className="text-center mb-6">Try a sample thread</p>
              <div className="flex flex-col items-center space-y-4">
                <Button variant="contained" color="primary">How I will be assessed for the CIS 1210 course</Button>
                <Button variant="contained" color="primary">Give me more information about CIS 2010</Button>
                <Button variant="contained" color="primary">What's the prerequisites for CIS 1001 course?</Button>
              </div>
              <div className="flex justify-center mt-6 space-x-4">
                <Button variant="outlined" color="primary">Talk with us</Button>
                <Button variant="outlined" color="primary">Feedback</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow p-4 bg-white overflow-auto">
            <div className="flex flex-col space-y-2">
              {messages.map((message, index) =>
                message.type === 'human' ? (
                  <div key={message.id} className={`flex justify-end mx-16 ${index === 0 ? 'mt-6' : ''}`}>
                    <div className="max-w-3/4 w-full text-right">
                      <div className="flex items-center justify-end mb-1">
                        <span className="font-bold ml-4">You</span>
                        <Avatar alt="User Avatar" src={logo_greg} sx={{ width: 25, height: 25 }} />
                      </div>
                      <div className="bg-custom p-2 rounded-xl inline-block text-left">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={message.id} className="flex justify-start mx-16">
                    <div className="max-w-3/4 w-full flex items-center">
                      <AIMessage
                        messageId={message.id}
                        content={message.content}
                        personaName={message.personaName}
                        citedDocuments={message.citedDocuments}
                        isComplete={isComplete}
                        hasDocs={!!message.citedDocuments?.length}
                        handleFeedback={(feedbackType: FeedbackType) => {
                          console.log(`Feedback received: ${feedbackType}`);
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        <div className="flex justify-center p-4 bg-white">
          <div style={{ maxWidth: '800px', width: '100%' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask a question about any courses in UPenn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleInputKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton color="primary" onClick={handleSendMessage}>
                    <SendIcon style={{ color: '#7C3BEC' }} />
                  </IconButton>
                ),
                style: {
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  color: '#100F32',
                  borderRadius: '16px',
                },
                classes: {
                  input: 'custom-placeholder',
                },
              }}
              className="custom-placeholder"
              style={{ borderRadius: '16px' }}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default HomeChat;
*/



/*
AJOUT DE LA LOGIQUE MAINTENANT DANS LE CHAT
*/
/*
import React, { useState, useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, TextField, IconButton, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import logo from '../logo_lucy.png';
import logo_greg from '../photo_greg.png';
import logo_ecole_penn from '../logo_penn.png';
import '../index.css';

import { ThreeDots } from 'react-loader-spinner';

import { AIMessage, HumanMessage } from '../components/Messages';
import { FeedbackType } from '../components/types';
import { ValidSources } from '../components/sources';
import { AnswerDocument, AnswerPiecePacket, AnswerDocumentPacket, StreamingError } from '../interfaces/interfaces'; // Import correct
import { getChatHistory, sendMessage } from '../api/chat';
import { getHumanAndAIMessageFromMessageNumber, getLastSuccessfulMessageId, handleAutoScroll } from '../components/utils';
import { usePopup } from '../components/popup';
import { createChatSession, nameChatSession } from '../api/sessions';

const theme = createTheme({
  palette: {
    primary: {
      main: '#EBE2FC',
    },
    secondary: {
      main: '#19857b',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          color: '#7C3BEC',
        },
      },
    },
  },
});

type Message = {
  id: number;
  type: 'human' | 'ai' | 'error';
  content: string;
  personaName?: string;
  citedDocuments?: AnswerDocument[];
};

const HomeChat: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const [isStreaming, setIsStreaming] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<[FeedbackType, number] | null>(null);
  const [selectedMessageForDocDisplay, setSelectedMessageForDocDisplay] = useState<number | null>(null);

  const { popup, setPopup } = usePopup();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const endDivRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    setShowChat(true);
    setIsComplete(false);
    setIsStreaming(true);

    const newMessage: Message = { id: Date.now(), type: 'human', content: inputValue };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue('');

    const messageHistory = [...messages, newMessage];

    onSubmit(messageHistory, inputValue);
  };

  const onSubmit = async (messageHistory: Message[], inputValue: string) => {
    setIsStreaming(true);
    let answer = '';
    let answerDocuments: AnswerDocument[] = [];
    let error: string | null = null;

    try {
      for await (const packetBunch of sendMessage({
        message: inputValue,
        chatSessionId: 'chat_sessions_test',
        courseId: 'course_id_placeholder',
        username: 'username_placeholder',
      })) {
        for (const packet of packetBunch) {
          if (Object.prototype.hasOwnProperty.call(packet, 'answer_piece')) {
            answer += (packet as AnswerPiecePacket).answer_piece;
          } else if (Object.prototype.hasOwnProperty.call(packet, 'answer_document')) {
            answerDocuments.push((packet as AnswerDocumentPacket).answer_document);
          } else if (Object.prototype.hasOwnProperty.call(packet, 'error')) {
            error = (packet as StreamingError).error;
          }
        }

        setMessages([
          ...messageHistory,
          {
            id: Date.now(),
            type: 'human',
            content: inputValue,
          },
          {
            id: Date.now(),
            type: error ? 'error' : 'ai',
            content: error || answer,
            personaName: 'Lucy',
            citedDocuments: answerDocuments,
          },
        ]);

        if (isCancelled) {
          setIsCancelled(false);
          break;
        }
      }
    } catch (e: any) {
      const errorMsg = e.message;
      setMessages([
        ...messageHistory,
        {
          id: Date.now(),
          type: 'human',
          content: inputValue,
        },
        {
          id: Date.now(),
          type: 'error',
          content: errorMsg,
        },
      ]);
    }

    setIsStreaming(false);
  };

  const handleInputKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMeetingClick = () => {
    navigate('/schedule-meeting');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="relative p-4 bg-white flex items-center justify-between border-b border-gray-100">
          <img src={logo} alt="Lucy Logo" className="h-12 w-auto" />
          {showChat && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold text-custom-blue">
                Lucy Orientation Chatbot
              </h1>
            </div>
          )}
          <div style={{ flexGrow: 1 }}></div>
          <img src={logo_ecole_penn} alt="Another Logo" className="h-10 w-auto" style={{ marginRight: '10px' }} />
          <Button variant="outlined" color="primary" onClick={handleMeetingClick}>Book a meeting</Button>
        </div>
        {!showChat ? (
          <div className="flex-grow flex items-center justify-center w-full">
            <div className="w-full h-full p-8 bg-white flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-center mb-6 text-custom-blue">Lucy Orientation Chatbot</h1>
              <p className="text-center mb-6">Try a sample thread</p>
              <div className="flex flex-col items-center space-y-4">
                <Button variant="contained" color="primary">How I will be assessed for the CIS 1210 course</Button>
                <Button variant="contained" color="primary">Give me more information about CIS 2010</Button>
                <Button variant="contained" color="primary">What's the prerequisites for CIS 1001 course?</Button>
              </div>
              <div className="flex justify-center mt-6 space-x-4">
                <Button variant="outlined" color="primary">Talk with us</Button>
                <Button variant="outlined" color="primary">Feedback</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow p-4 bg-white overflow-auto">
            <div className="flex flex-col space-y-2">
              {messages.map((message, index) =>
                message.type === 'human' ? (
                  <div key={message.id} className={`flex justify-end mx-16 ${index === 0 ? 'mt-6' : ''}`}>
                    <div className="max-w-3/4 w-full text-right">
                      <div className="flex items-center justify-end mb-1">
                        <span className="font-bold ml-4">You</span>
                        <Avatar alt="User Avatar" src={logo_greg} sx={{ width: 25, height: 25 }} />
                      </div>
                      <div className="bg-custom p-2 rounded-xl inline-block text-left">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={message.id} className="flex justify-start mx-16">
                    <div className="max-w-3/4 w-full flex items-center">
                      <AIMessage
                        messageId={message.id}
                        content={message.content}
                        personaName={message.personaName}
                        citedDocuments={message.citedDocuments}
                        isComplete={isComplete}
                        hasDocs={!!message.citedDocuments?.length}
                        handleFeedback={(feedbackType: FeedbackType) => {
                          console.log(`Feedback received: ${feedbackType}`);
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        <div className="flex justify-center p-4 bg-white">
          <div style={{ maxWidth: '800px', width: '100%' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask a question about any courses in UPenn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleInputKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton color="primary" onClick={handleSendMessage}>
                    <SendIcon style={{ color: '#7C3BEC' }} />
                  </IconButton>
                ),
                style: {
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  color: '#100F32',
                  borderRadius: '16px',
                },
                classes: {
                  input: 'custom-placeholder',
                },
              }}
              className="custom-placeholder"
              style={{ borderRadius: '16px' }}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default HomeChat;
*/







/*
import React, { useState, useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, TextField, IconButton, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import logo from '../logo_lucy.png';
import logo_greg from '../photo_greg.png';
import logo_ecole_penn from '../logo_penn.png';
import '../index.css';

import { ThreeDots } from 'react-loader-spinner';

import { AIMessage, HumanMessage } from '../components/Messages';
import { FeedbackType } from '../components/types';
import { ValidSources } from '../components/sources';
import { AnswerDocument, AnswerPiecePacket, AnswerDocumentPacket, StreamingError } from '../interfaces/interfaces';
import { getChatHistory, sendMessage } from '../api/chat';
import { getHumanAndAIMessageFromMessageNumber, getLastSuccessfulMessageId, handleAutoScroll } from '../components/utils';
import { usePopup } from '../components/popup';
import { createChatSession, nameChatSession } from '../api/sessions';

const theme = createTheme({
  palette: {
    primary: {
      main: '#EBE2FC',
    },
    secondary: {
      main: '#19857b',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          color: '#7C3BEC',
        },
      },
    },
  },
});

type Message = {
  id: number;
  type: 'human' | 'ai' | 'error';
  content: string;
  personaName?: string;
  citedDocuments?: AnswerDocument[];
};

const HomeChat: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const [isStreaming, setIsStreaming] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<[FeedbackType, number] | null>(null);
  const [selectedMessageForDocDisplay, setSelectedMessageForDocDisplay] = useState<number | null>(null);

  const { popup, setPopup } = usePopup();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const endDivRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    setShowChat(true);
    setIsComplete(false);
    setIsStreaming(true);

    const newMessage: Message = { id: Date.now(), type: 'human', content: inputValue };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue('');

    const messageHistory = [...messages, newMessage];

    onSubmit(messageHistory, inputValue);
  };

  const onSubmit = async (messageHistory: Message[], inputValue: string) => {
    setIsStreaming(true);
    let answer = '';
    let answerDocuments: AnswerDocument[] = [];
    let error: string | null = null;

    try {
      for await (const packetBunch of sendMessage({
        message: inputValue,
        chatSessionId: 'chat_sessions_test',
        courseId: 'course_id_placeholder',
        username: 'username_placeholder',
      })) {
        console.log("Packet bunch:", packetBunch);  // Ajoutez ce log pour inspecter le paquet de réponses
        for (const packet of packetBunch) {
          if (Object.prototype.hasOwnProperty.call(packet, 'answer_piece')) {
            answer += (packet as AnswerPiecePacket).answer_piece;
          } else if (Object.prototype.hasOwnProperty.call(packet, 'answer_document')) {
            answerDocuments.push((packet as AnswerDocumentPacket).answer_document);
          } else if (Object.prototype.hasOwnProperty.call(packet, 'error')) {
            error = (packet as StreamingError).error;
          }
        }
      }

      setMessages([
        ...messageHistory,
        {
          id: Date.now(),
          type: error ? 'error' : 'ai',
          content: error || answer,
          personaName: 'Lucy',
          citedDocuments: answerDocuments,
        },
      ]);

      if (isCancelled) {
        setIsCancelled(false);
      }
    } catch (e: any) {
      const errorMsg = e.message;
      console.log("Error message:", errorMsg);  // Ajoutez ce log pour vérifier le message d'erreur
      setMessages([
        ...messageHistory,
        {
          id: Date.now(),
          type: 'error',
          content: "An error occurred. The API endpoint might be down.",
        },
      ]);
    }

    setIsStreaming(false);
  };

  const handleInputKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMeetingClick = () => {
    navigate('/schedule-meeting');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="relative p-4 bg-white flex items-center justify-between border-b border-gray-100">
          <img src={logo} alt="Lucy Logo" className="h-12 w-auto" />
          {showChat && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold text-custom-blue">
                Lucy Orientation Assistant
              </h1>
            </div>
          )}
          <div style={{ flexGrow: 1 }}></div>
          <img src={logo_ecole_penn} alt="Another Logo" className="h-10 w-auto" style={{ marginRight: '10px' }} />
          <Button variant="outlined" color="primary" onClick={handleMeetingClick}>Book a meeting</Button>
        </div>
        {!showChat ? (
          <div className="flex-grow flex items-center justify-center w-full">
            <div className="w-full h-full p-8 bg-white flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-center mb-6 text-custom-blue">Lucy Orientation Assistant</h1>
              <p className="text-center mb-6">Try a sample thread</p>
              <div className="flex flex-col items-center space-y-4">
                <Button variant="contained" color="primary">How I will be assessed for the CIS 1210 course</Button>
                <Button variant="contained" color="primary">Give me more information about CIS 2010</Button>
                <Button variant="contained" color="primary">What's the prerequisites for CIS 1001 course?</Button>
              </div>
              <div className="flex justify-center mt-6 space-x-4">
                <Button variant="outlined" color="primary">Talk with us</Button>
                <Button variant="outlined" color="primary">Feedback</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow p-4 bg-white overflow-auto">
            <div className="flex flex-col space-y-2">
              {messages.map((message, index) =>
                message.type === 'human' ? (
                  <div key={message.id} className={`flex justify-end mx-16 ${index === 0 ? 'mt-6' : ''}`}>
                    <div className="max-w-3/4 w-full text-right">
                      <div className="flex items-center justify-end mb-1">
                        <span className="font-bold ml-4">You</span>
                        <Avatar alt="User Avatar" src={logo_greg} sx={{ width: 25, height: 25 }} />
                      </div>
                      <div className="bg-custom p-2 rounded-xl inline-block text-left">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={message.id} className="flex justify-start mx-16">
                    <div className="max-w-3/4 w-full flex items-center">
                      <AIMessage
                        messageId={message.id}
                        content={message.content}
                        personaName={message.personaName}
                        citedDocuments={message.citedDocuments}
                        isComplete={isComplete}
                        hasDocs={!!message.citedDocuments?.length}
                        handleFeedback={(feedbackType: FeedbackType) => {
                          console.log(`Feedback received: ${feedbackType}`);
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        <div className="flex justify-center p-4 bg-white">
          <div style={{ maxWidth: '800px', width: '100%' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask a question about any courses in UPenn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleInputKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton color="primary" onClick={handleSendMessage}>
                    <SendIcon style={{ color: '#7C3BEC' }} />
                  </IconButton>
                ),
                style: {
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  color: '#100F32',
                  borderRadius: '16px',
                },
                classes: {
                  input: 'custom-placeholder',
                },
              }}
              className="custom-placeholder"
              style={{ borderRadius: '16px' }}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default HomeChat;
*/












//NOUVELLE VERSION QUI PRENDS EN COMPTE LE LOADER ET LE STREAM 
import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, TextField, IconButton, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import logo from '../logo_lucy.png';
import logo_greg from '../photo_greg.png';
import logo_lucy_face from '../lucy_face.png';
import logo_ecole_penn from '../logo_penn.png';
import '../index.css';

import { ThreeDots } from 'react-loader-spinner';
import { FallingLines } from 'react-loader-spinner';

import { AIMessage, HumanMessage } from '../components/Messages';
import { FeedbackType } from '../components/types';
import { ValidSources } from '../components/sources';
import { AnswerDocument, AnswerPiecePacket, AnswerDocumentPacket, StreamingError } from '../interfaces/interfaces';
import { getChatHistory, sendMessage } from '../api/chat';
import { getHumanAndAIMessageFromMessageNumber, getLastSuccessfulMessageId, handleAutoScroll } from '../components/utils';
import { usePopup } from '../components/popup';
import { createChatSession, nameChatSession } from '../api/sessions';

const theme = createTheme({
  palette: {
    primary: {
      main: '#EBE2FC',
    },
    secondary: {
      main: '#19857b',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          color: '#7C3BEC',
        },
      },
    },
  },
});

type Message = {
  id: number;
  type: 'human' | 'ai' | 'error';
  content: string;
  personaName?: string;
  citedDocuments?: AnswerDocument[];
};

const HomeChat: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const [isStreaming, setIsStreaming] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<[FeedbackType, number] | null>(null);
  const [selectedMessageForDocDisplay, setSelectedMessageForDocDisplay] = useState<number | null>(null);

  const { popup, setPopup } = usePopup();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const endDivRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    setShowChat(true);
    setIsComplete(false);
    setIsStreaming(true);

    const newMessage: Message = { id: Date.now(), type: 'human', content: inputValue };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Ajoutez un message temporaire pour le loader
    const loadingMessage: Message = { id: Date.now() + 1, type: 'ai', content: '', personaName: 'Lucy' };
    setMessages((prevMessages) => [...prevMessages, loadingMessage]);
    
    setInputValue('');

    const messageHistory = [...messages, newMessage, loadingMessage];

    onSubmit(messageHistory, inputValue);
  };

  const onSubmit = async (messageHistory: Message[], inputValue: string) => {
    setIsStreaming(true);
    let answer = '';
    let answerDocuments: AnswerDocument[] = [];
    let error: string | null = null;

    try {
      const chatSessionId = 'chat_sessions_test';
      const courseId = 'course_id_placeholder';
      const username = 'username_placeholder';

      const lastMessageIndex = messageHistory.length - 1;

      for await (const packetBunch of sendMessage({
        message: inputValue,
        chatSessionId: chatSessionId,
        courseId: courseId,
        username: username,
      })) {
        console.log("Packet bunch:", packetBunch);
        for (const packet of packetBunch) {
          if (Object.prototype.hasOwnProperty.call(packet, 'answer_piece')) {
            answer += (packet as AnswerPiecePacket).answer_piece;
          } else if (Object.prototype.hasOwnProperty.call(packet, 'answer_document')) {
            answerDocuments.push((packet as AnswerDocumentPacket).answer_document);
          } else if (Object.prototype.hasOwnProperty.call(packet, 'error')) {
            error = (packet as StreamingError).error;
          }
        }

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[lastMessageIndex] = {
            id: Date.now(),
            type: 'ai',
            content: answer,
            personaName: 'Lucy',
            citedDocuments: answerDocuments,
          };
          return updatedMessages;
        });

        if (isCancelled) {
          setIsCancelled(false);
          break;
        }
      }

      setIsStreaming(false);
    } catch (e: any) {
      const errorMsg = e.message;
      console.log("Error message:", errorMsg);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          type: 'error',
          content: "An error occurred. The API endpoint might be down.",
        },
      ]);
      setIsStreaming(false);
    }
  };

  const handleInputKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMeetingClick = () => {
    navigate('/schedule-meeting');
  };

  useEffect(() => {
    if (isStreaming) {
      handleAutoScroll(endDivRef, scrollableDivRef);
    }
  }, [isStreaming, messages]);

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="relative p-4 bg-white flex items-center justify-between border-b border-gray-100">
          <img src={logo} alt="Lucy Logo" className="h-12 w-auto" />
          {showChat && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold text-custom-blue">
                Lucy Orientation Assistant
              </h1>
            </div>
          )}
          <div style={{ flexGrow: 1 }}></div>
          <img src={logo_ecole_penn} alt="Another Logo" className="h-10 w-auto" style={{ marginRight: '10px' }} />
          <Button variant="outlined" color="primary" onClick={handleMeetingClick}>Book a meeting</Button>
        </div>
        {!showChat ? (
          <div className="flex-grow flex items-center justify-center w-full">
            <div className="w-full h-full p-8 bg-white flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-center mb-6 text-custom-blue">Lucy Orientation Assistant</h1>
              <p className="text-center mb-6">Try a sample thread</p>
              <div className="flex flex-col items-center space-y-4">
                <Button variant="contained" color="primary">How I will be assessed for the CIS 1210 course</Button>
                <Button variant="contained" color="primary">Give me more information about CIS 2010</Button>
                <Button variant="contained" color="primary">What's the prerequisites for CIS 1001 course?</Button>
              </div>
              <div className="flex justify-center mt-6 space-x-4">
                <Button variant="outlined" color="primary">Talk with us</Button>
                <Button variant="outlined" color="primary">Feedback</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow p-4 bg-white overflow-auto">
            <div className="flex flex-col space-y-2" ref={scrollableDivRef}>
              {messages.map((message, index) =>
                message.type === 'human' ? (
                  <div key={message.id} className={`flex justify-end mx-20 ${index === 0 ? 'mt-8' : ''}`}> 
                    <div className="max-w-3/4 w-full text-right">
                      <div className="flex items-center justify-end mb-1">
                        <span className="font-bold ml-4">You</span>
                        <Avatar alt="User Avatar" src={logo_greg} sx={{ width: 25, height: 25 }} />
                      </div>
                      <div className="bg-custom p-2 rounded-xl inline-block text-left">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={message.id} className="flex justify-start mx-20">
                    <div className="max-w-3/4 w-full flex items-center">

                        
                      {message.content === '' ? (
                        <div className="flex items-center">
                          <Avatar alt="Lucy Avatar" src={logo_lucy_face} sx={{ width: 25, height: 25 }} />
                          <div className="ml-2">
                            
                            <FallingLines height="30" width="50" color="#955bf7" />
                          </div>
                        </div>
                      ) : (
                        <AIMessage
                          messageId={message.id}
                          content={message.content}
                          personaName={message.personaName}
                          citedDocuments={message.citedDocuments}
                          isComplete={isComplete}
                          hasDocs={!!message.citedDocuments?.length}
                          handleFeedback={(feedbackType: FeedbackType) => {
                            console.log(`Feedback received: ${feedbackType}`);
                          }}
                        />
                      )}
                    </div>
                  </div>
                )
              )}
              <div ref={endDivRef}></div>
            </div>
          </div>
        )}
        <div className="flex justify-center p-4 bg-white">
          <div style={{ maxWidth: '800px', width: '100%' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask a question about any courses in UPenn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleInputKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton color="primary" onClick={handleSendMessage}>
                    <SendIcon style={{ color: '#7C3BEC' }} />
                  </IconButton>
                ),
                style: {
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  color: '#100F32',
                  borderRadius: '16px',
                },
                classes: {
                  input: 'custom-placeholder',
                },
              }}
              className="custom-placeholder"
              style={{ borderRadius: '16px' }}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default HomeChat;















