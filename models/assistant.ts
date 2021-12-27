export interface Assistant {
  avatar: string;
  name: string;
  voiceCommand: boolean;
}

export interface AssistantWithUrl {
  assistant: Assistant;
  imageUrl: string;
}
