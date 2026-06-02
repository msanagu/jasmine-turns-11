export interface RSVP {
  id: string;
  name: string;
  attending: boolean;
  adultCount: number;
  childCount: number;
  bringingBoogieBoard: boolean;
  boogieBoardCount: number;
  avatarStyle: 'shark' | 'volleyball' | 'crab' | 'sunset' | 'shell' | 'umbrella' | 'palm' | 'coral' | 'waves' | 'dolphin' | 'hibiscus' | 'drink' | 'swimsuit' | 'pineapple';
  timestamp: string;
  message?: string;
}

export interface BeachItem {
  id: string;
  name: string;
  packed: boolean;
  required: boolean;
  icon: string;
}
