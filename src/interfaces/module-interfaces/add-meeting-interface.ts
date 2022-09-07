import { IMeetingRoomsApiModel } from "../api-interfaces/buildings-api-interface";

export type IFormFieldsKeys =
  | "title"
  | "date"
  | "startTime"
  | "endTime"
  | "building";

type IFormFieldsTypes = "textfield" | "date" | "time" | "select";

export type IFormKeysAndTypes = {
  key: string;
  type: IFormFieldsTypes;
};

export type IInputFieldsModel = {
  label: string;
  type: IFormFieldsTypes;
  value?: Date | string | number;
  error?: boolean;
};

export type IMeetingRoomForm = {
  [x in IFormFieldsKeys]: IInputFieldsModel;
};

export interface IModelConfig {
  open: boolean;
  selectedCardId?: string;
  rooms: IMeetingRoomsApiModel[];
}
