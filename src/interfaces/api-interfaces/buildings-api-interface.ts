export interface IMeetingsApiModel {
  title?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

export interface IMeetingRoomsApiModel {
  name?: string;
  meetings?: IMeetingsApiModel[];
}

export interface IBuildingsDataApiModel {
  name?: string;
  meetingRooms?: IMeetingRoomsApiModel[];
}

export interface IBuildingsDataResponse {
  Buildings?: IBuildingsDataApiModel;
}
