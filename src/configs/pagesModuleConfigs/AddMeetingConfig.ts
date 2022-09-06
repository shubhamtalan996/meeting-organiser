import { IMeetingRoomForm } from "../../interfaces/module-interfaces/add-meeting-interface";

export const getDefaultMeetingRoomForm = (): IMeetingRoomForm => {
  const [day, month, year] = new Date().toLocaleDateString().split("/");
  const [hour, minutes] = new Date().toLocaleTimeString().split(":");
  const [endTimeHour, endTimeMinutes] = new Date(
    new Date().getTime() + 1000 * 60 * 30
  )
    .toLocaleTimeString()
    .split(":");
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
      value: `${endTimeHour}:${endTimeMinutes}`,
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
