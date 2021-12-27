export interface Assistant {
  name: string;
  voiceCommand: boolean;
  avatar: string;
}

export interface AssistantWithUrl {
  name: string;
  voiceCommand: boolean;
  avatar: string;
  avatarUrl: string;
}
