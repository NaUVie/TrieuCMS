import axiosClient from '../api/axiosClient';

const chatbotService = {
  chat: (message, history) => {
    const url = '/chatbot/chat';
    return axiosClient.post(url, { message, history });
  }
};

export default chatbotService;
