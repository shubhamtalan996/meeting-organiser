export interface IMeetingsApiModel {
  title?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

export interface IBuildingModel {
  id?: number;
  name?: string;
}

export interface IMeetingRoomsApiModel {
  id?: string;
  name?: string;
  floor?: string;
  building?: IBuildingModel;
  meetings?: IMeetingsApiModel[];
}

export interface IBuildingsDataApiModel {
  name?: string;
  id?: number;
  meetingRooms?: IMeetingRoomsApiModel[];
}

export interface IBuildingsDataResponse {
  Buildings?: IBuildingsDataApiModel[];
}

export interface IShowSnackBar {
  open?: boolean;
  message?: string;
  severity?: "error" | "warning" | "info" | "success";
}
