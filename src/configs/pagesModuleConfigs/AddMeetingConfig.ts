import { IMeetingRoomForm } from "../../interfaces/module-interfaces/add-meeting-interface";

export const getDefaultMeetingRoomForm = (): IMeetingRoomForm => {
  const [day, month, year] = new Date().toLocaleDateString().split("/");
  const [hour, minutes] = new Date().toLocaleTimeString().split(":");
  return {
    title: {
      label: "Title",
      type: "textfield",
      value: "Untitled Meeting",
      error: false,
    },
    date: {
      label: "Selected Date",
      type: "date",
      value: `${year}-${month}-${day}`,
      error: false,
    },
    startTime: {
      label: "Start Time",
      type: "time",
      value: `${hour}:${minutes}`,
      error: false,
    },
    endTime: {
      label: "End Time",
      type: "time",
      value: `${hour}:${Number(minutes) + 30}`,
      error: false,
    },
    building: {
      label: "Building",
      type: "select",
      value: "",
      error: false,
    },
  };
};
