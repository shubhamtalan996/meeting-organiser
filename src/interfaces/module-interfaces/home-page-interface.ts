export interface ITimeFrame {
  date: Date;
  startTime: number;
  endTime: number;
}

export type IFieldsKeys =
  | "totalBuildings"
  | "totalRooms"
  | "freeRooms"
  | "totalMeetingsToday"
  | "totalMeetingsNow";

export interface IHomePageFields {
  totalBuildings?: Number;
  totalRooms?: Number;
  freeRooms?: Number;
  totalMeetingsToday?: Number;
  totalMeetingsNow?: Number;
}

export interface IHomePageFields {
  totalBuildings?: Number;
  totalRooms?: Number;
  freeRooms?: Number;
  totalMeetingsToday?: Number;
  totalMeetingsNow?: Number;
}

export interface ISubText {
  key?: string;
  label?: string;
  value?: string;
}

export interface ILabelCardFields {
  key: string;
  label?: string;
  wrapperClass?: string;
  subTexts?: ISubText[];
}
