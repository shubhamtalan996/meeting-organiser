import {
  IBuildingsDataApiModel,
  IMeetingRoomsApiModel,
  IMeetingsApiModel,
} from "../../../interfaces/api-interfaces/buildings-api-interface";
import { ITimeFrame } from "../../../interfaces/module-interfaces/home-page-interface";
import {
  IHomePageFields,
  ISubText,
  IFieldsKeys,
  ILabelCardFields,
} from "../../../interfaces/module-interfaces/home-page-interface";
import {
  IFormFieldsKeys,
  IInputFieldsModel,
  IMeetingRoomForm,
} from "../../../interfaces/module-interfaces/add-meeting-interface";
import { convertTimeToMinutes, dateFieldToEpoch } from "../tools";

const iterate = (field?: number) => {
  let iterator = field;
  if (typeof iterator !== "number") {
    iterator = 1;
  } else {
    iterator++;
  }
  return iterator;
};

export const isMeetingsClashing = (
  meeting: IMeetingsApiModel,
  timeFrame: ITimeFrame
): boolean => {
  const meetingDate = meeting?.date;

  /* As Date coming from API is in same format */
  const requiredDate = timeFrame?.date?.toLocaleDateString();
  let requiredDateEpoch: number = 0;
  if (timeFrame?.date?.getTime()) {
    requiredDateEpoch = Math.floor(timeFrame?.date?.getTime() / (1000 * 60));
  }

  let meetingStartTimeSeconds: number = 0;
  let meetingEndTimeSeconds: number = 0;
  let requiredStartTimeEpoch: number = 0;
  let requiredEndTimeEpoch: number = 0;

  if (meeting?.startTime) {
    const [hours, minutes] = meeting?.startTime.split(":");
    if (Number(hours) > 0) meetingStartTimeSeconds = Number(hours) * 60 * 60;

    if (Number(minutes) > 0) meetingStartTimeSeconds += Number(minutes) * 60;
  }
  if (meeting?.endTime) {
    const [hours, minutes] = meeting?.endTime.split(":");
    if (Number(hours) > 0) meetingEndTimeSeconds = Number(hours) * 60 * 60;

    if (Number(minutes) > 0) meetingEndTimeSeconds += Number(minutes) * 60;
  }

  if (requiredDateEpoch && timeFrame?.startTime)
    requiredStartTimeEpoch = requiredDateEpoch + timeFrame?.startTime;

  if (requiredDateEpoch && timeFrame?.endTime)
    requiredEndTimeEpoch = requiredDateEpoch + timeFrame?.endTime;
  return (
    meetingDate === requiredDate &&
    ((requiredStartTimeEpoch > meetingStartTimeSeconds &&
      requiredStartTimeEpoch < meetingEndTimeSeconds) ||
      (requiredEndTimeEpoch > meetingStartTimeSeconds &&
        requiredEndTimeEpoch < meetingEndTimeSeconds))
  );
};

export const getSubTextsWithValue = (
  subTexts?: ISubText[],
  homePageFields?: IHomePageFields
) => {
  let tempSubTexts: ISubText[] = [];
  if (subTexts && subTexts?.length) {
    subTexts.forEach((subText) => {
      let tempSubText = { ...subText };
      const key = subText?.key as IFieldsKeys;
      if (homePageFields && homePageFields[key]) {
        tempSubText.value = homePageFields[key]?.toString();
      }
      tempSubTexts.push(tempSubText);
    });
  }
  return tempSubTexts;
};

export const toBuildingDataApiTransform = (
  buildings: IBuildingsDataApiModel[],
  labelcardfields: ILabelCardFields[]
): ILabelCardFields[] => {
  let fieldsData: IHomePageFields = {};
  let tempLabelCardFields: ILabelCardFields[] = [];
  if (buildings && buildings?.length) {
    let totalBuildings: number | undefined = 0;
    let totalRooms: number | undefined = 0;
    let freeRooms: number | undefined = 0;
    let totalMeetingsToday: number | undefined = 0;
    let totalMeetingsNow: number | undefined = 0;
    const timeNow = new Date();

    try {
      buildings.forEach(({ meetingRooms }: IBuildingsDataApiModel) => {
        totalBuildings = iterate(totalBuildings);
        if (meetingRooms && meetingRooms?.length) {
          meetingRooms.forEach(({ meetings }: IMeetingRoomsApiModel) => {
            totalRooms = iterate(totalRooms);
            let isMeetingRoomAvailable = true;
            if (meetings?.length) {
              meetings.forEach((meeting: IMeetingsApiModel) => {
                const { date: meetingDate } = meeting;

                const todaysDate = timeNow.toLocaleDateString();
                if (meetingDate === todaysDate) {
                  totalMeetingsToday = iterate(totalMeetingsToday);
                }

                if (
                  isMeetingsClashing(meeting, {
                    date: timeNow,
                    startTime: convertTimeToMinutes(
                      timeNow?.toLocaleTimeString()
                    ),
                    endTime: convertTimeToMinutes(
                      timeNow?.toLocaleTimeString()
                    ),
                  })
                ) {
                  isMeetingRoomAvailable = false;
                }
              });
            }
            if (isMeetingRoomAvailable) {
              freeRooms = iterate(freeRooms);
            } else {
              totalMeetingsNow = iterate(totalMeetingsNow);
            }
          });
        }
      });

      fieldsData = {
        totalBuildings,
        totalRooms,
        freeRooms,
        totalMeetingsToday,
        totalMeetingsNow,
      };

      if (labelcardfields && labelcardfields?.length) {
        labelcardfields.forEach((field) => {
          let tempSubTexts: ISubText[] = [];
          if (field?.subTexts?.length) {
            tempSubTexts = getSubTextsWithValue(field?.subTexts, fieldsData);
          }
          tempLabelCardFields?.push({
            ...field,
            subTexts: tempSubTexts,
          });
        });
      }
    } catch (error) {
      console.error(error);
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }
  }

  return tempLabelCardFields;
};

export const getAvailableRooms = (
  building: IBuildingsDataApiModel,
  meetingRoomForm: IMeetingRoomForm
) => {
  let freeMeetingRooms: IMeetingRoomsApiModel[] = [];
  const { meetingRooms } = building;

  if (meetingRooms && meetingRooms?.length) {
    meetingRooms.forEach((meetingRoom: IMeetingRoomsApiModel) => {
      const { meetings } = meetingRoom;
      let isMeetingRoomAvailable = true;
      if (meetings && meetings?.length) {
        meetings.forEach((meeting) => {
          const date = dateFieldToEpoch(meetingRoomForm?.date?.value as string);
          const startTime = convertTimeToMinutes(
            meetingRoomForm?.startTime?.value as string
          );
          const endTime = convertTimeToMinutes(
            meetingRoomForm?.endTime?.value as string
          );
          if (date && startTime && endTime) {
            const meetingRoomSpecs: ITimeFrame = {
              date,
              startTime,
              endTime,
            };
            if (isMeetingsClashing(meeting, meetingRoomSpecs)) {
              isMeetingRoomAvailable = false;
            }
          }
        });
      }
      if (isMeetingRoomAvailable) {
        freeMeetingRooms.push(meetingRoom);
      }
    });
  }

  return freeMeetingRooms;
};

export const isFieldValid = (
  key: IFormFieldsKeys,
  fieldData: IInputFieldsModel,
  meetingRoomForm: IMeetingRoomForm
): boolean => {
  let isValidField: boolean = true;

  if (!fieldData?.value) {
    isValidField = false;

    return isValidField;
  }
  switch (key) {
    case "date":
      const [year, month, day] = fieldData?.value.toString().split("-");
      const [tday, tmonth, tYear] = new Date().toLocaleDateString().split("/");

      if (
        +new Date(`${month}/${day}/${year}`) <
        +new Date(`${tmonth}/${tday}/${tYear}`)
      ) {
        isValidField = false;
      }
      break;
    case "startTime":
      {
        const [stHours, stMinutes] = fieldData?.value.toString().split(":");
        const [etHours, etMinutes] =
          meetingRoomForm?.endTime?.value?.toString().split(":") || [];
        const [hoursNow, minutesNow] = new Date()
          .toLocaleTimeString()
          .split(":");
        const now: number = 60 * Number(hoursNow) + Number(minutesNow);
        const startTime: number = 60 * Number(stHours) + Number(stMinutes);
        const endTime: number = 60 * Number(etHours) + Number(etMinutes);

        if (now > startTime || startTime >= endTime) {
          isValidField = false;
        }
      }
      break;
    case "endTime":
      {
        const [etHours, etMinutes] = fieldData?.value.toString().split(":");
        const [stHours, stMinutes] =
          meetingRoomForm?.startTime?.value?.toString().split(":") || [];
        const [hoursNow, minutesNow] = new Date()
          .toLocaleTimeString()
          .split(":");
        const now: number = 60 * Number(hoursNow) + Number(minutesNow);
        const startTime: number = 60 * Number(stHours) + Number(stMinutes);
        const endTime: number = 60 * Number(etHours) + Number(etMinutes);

        if (now > endTime || startTime >= endTime) {
          isValidField = false;
        }
      }
      break;
  }

  return isValidField;
};
