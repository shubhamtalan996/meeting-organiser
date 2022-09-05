import { ILabelCardFields } from "../../interfaces/module-interfaces/home-page-interface";

export const getDefaultLabelCardFields = (): ILabelCardFields[] => [
  {
    key: "buildings",
    label: "Buildings",
    wrapperClass: "",
    subTexts: [
      {
        key: "totalBuildings",
        label: "Total: ",
        value: "N/A",
      },
    ],
  },
  {
    key: "rooms",
    label: "Rooms",
    wrapperClass: "",
    subTexts: [
      {
        key: "totalRooms",
        label: "Total: ",
        value: "N/A",
      },
      {
        key: "freeRooms",
        label: "Free Now: ",
        value: "N/A",
      },
    ],
  },
  {
    key: "meetings",
    label: "Meetings",
    wrapperClass: "",
    subTexts: [
      {
        key: "totalMeetingsToday",
        label: "Total meeting today: ",
        value: "N/A",
      },
      {
        key: "totalMeetingsNow",
        label: "Total meeting goin on now: ",
        value: "N/A",
      },
    ],
  },
];
