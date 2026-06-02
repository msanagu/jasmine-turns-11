export interface RSVP {
  id: string;
  name: string;
  attending: boolean;
  adultCount: number;
  childCount: number;
  bringingBoogieBoard: boolean;
  boogieBoardCount: number;
  avatarStyle: 'surfboard' | 'volleyball' | 'sunglasses' | 'sun' | 'shell' | 'umbrella' | 'palm';
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
