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
  const requiredDateEpoch = timeFrame?.date?.toLocaleDateString();

  let meetingStartTimeSeconds: number = 0;
  let meetingEndTimeSeconds: number = 0;

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

  const todaysEpoch = +new Date(`${new Date().toDateString()}`);

  const requiredStartTimeEpoch = Math.floor(
    (Number(+new Date(timeFrame?.startTime as Date)) - Number(todaysEpoch)) /
      1000
  );
  const requiredEndTimeEpoch = Math.floor(
    (Number(+new Date(timeFrame?.endTime as Date)) - Number(todaysEpoch)) / 1000
  );

  return (
    meetingDate === requiredDateEpoch &&
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
                    startTime: timeNow,
                    endTime: timeNow,
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
