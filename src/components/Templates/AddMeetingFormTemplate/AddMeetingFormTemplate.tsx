import { Dispatch } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {
  IFormFieldsKeys,
  IFormKeysAndTypes,
  IInputFieldsModel,
  IMeetingRoomForm,
} from "../../../interfaces/module-interfaces/add-meeting-interface";
import { MIN_MEETING_DURATION } from "../../../configs/pagesModuleConfigs/AddMeetingConfig";
import {
  getAvailableRooms,
  isFieldValid,
} from "../../../utils/api/api-transforms/buildings-api-transform";
import {
  IBuildingsDataApiModel,
  IMeetingRoomsApiModel,
} from "../../../interfaces/api-interfaces/buildings-api-interface";
import { localeDateFieldToEpoch } from "../../../utils/api/tools";

interface IAddMeetingFormTemplateProps {
  meetingRoomForm: IMeetingRoomForm;
  handleMeetingRoomForm: Dispatch<React.SetStateAction<IMeetingRoomForm>>;
  buildings: IBuildingsDataApiModel[];
  handleModalState: (open: boolean, rooms: IMeetingRoomsApiModel[]) => void;
}

const AddMeetingFormTemplate: React.FC<IAddMeetingFormTemplateProps> = ({
  meetingRoomForm,
  handleMeetingRoomForm,
  buildings,
  handleModalState,
}) => {
  /** Handler function logic **/
  const handleFieldValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    { key, type }: IFormKeysAndTypes
  ) => {
    let tempField: IInputFieldsModel = {
      ...meetingRoomForm[key as IFormFieldsKeys],
    };

    if (type !== "select") {
      tempField.value = e.currentTarget.value;
    } else {
      tempField.value = e.target.value;
    }
    const isValid = isFieldValid(
      key as IFormFieldsKeys,
      tempField,
      meetingRoomForm
    );

    // Special handling for start time in sync with end time
    if (key === "startTime" && isValid) {
      const todaysDate = new Date().toLocaleDateString();
      const [stHours, stMinutes] = tempField?.value.toString().split(":");
      const startTime: number = 60 * Number(stHours) + Number(stMinutes);
      const [etHours, etMinutes] =
        meetingRoomForm?.endTime?.value?.toString().split(":") || [];
      const endTime: number = 60 * Number(etHours) + Number(etMinutes);

      if (startTime + MIN_MEETING_DURATION >= endTime) {
        const tempEndTime = { ...meetingRoomForm?.endTime };
        const [uetHours, uetMinutes] = new Date(
          Number(localeDateFieldToEpoch(todaysDate)) +
            (startTime + 30) * 60 * 1000
        )
          .toLocaleTimeString()
          .split(":");
        tempEndTime.value = `${uetHours}:${uetMinutes}`;
        tempEndTime.error = false;
        tempField.error = false;
        handleMeetingRoomForm((prevSpecs: IMeetingRoomForm) => ({
          ...prevSpecs,
          [key]: tempField,
          endTime: tempEndTime,
        }));
      } else {
        tempField.error = false;
        handleMeetingRoomForm((prevSpecs: IMeetingRoomForm) => ({
          ...prevSpecs,
          [key]: tempField,
        }));
      }
    } else {
      if (isValid) {
        tempField = {
          ...tempField,
          error: false,
        };
        updateFormWithKey(key as IFormFieldsKeys, tempField);
      } else {
        tempField = {
          ...meetingRoomForm[key as IFormFieldsKeys],
          error: true,
        };
        updateFormWithKey(key as IFormFieldsKeys, tempField);
      }
    }
  };

  const updateFormWithKey = (
    key: IFormFieldsKeys,
    fieldData: IInputFieldsModel
  ) => {
    handleMeetingRoomForm((prevSpecs: IMeetingRoomForm) => ({
      ...prevSpecs,
      [key]: fieldData,
    }));
  };
  /** Final Form Validator **/
  const validateMeetingDetailsForm = (): boolean => {
    let isValid = true;
    Object.entries(meetingRoomForm).forEach(([key, fieldData]) => {
      const isValidField: boolean = isFieldValid(
        key as IFormFieldsKeys,
        fieldData,
        meetingRoomForm
      );

      let tempFieldData: IInputFieldsModel = { ...fieldData };
      tempFieldData.error = !isValidField;
      updateFormWithKey(key as IFormFieldsKeys, tempFieldData);

      if (!isValidField) {
        isValid = false;
        return;
      }
    });
    return isValid;
  };

  const submitMeetingDetails = () => {
    if (validateMeetingDetailsForm()) {
      if (buildings && buildings?.length && meetingRoomForm?.building?.value) {
        const building = buildings?.find(
          ({ id, ...rest }: IBuildingsDataApiModel) =>
            id === Number(meetingRoomForm?.building?.value)
        );
        if (building) {
          handleModalState(true, getAvailableRooms(building, meetingRoomForm));
        }
      }
    }
  };
  return (
    <>
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="center"
        className="fields-wrapper"
        alignSelf="center"
      >
        {meetingRoomForm &&
          Object.entries(meetingRoomForm).map(
            ([fieldKey, { label, type, value, error }]) => (
              <Box className="field-wrapper" key={`${fieldKey}-${type}`}>
                <Typography className="label">{label}</Typography>
                {
                  <TextField
                    key={fieldKey}
                    select={type === "select"}
                    value={value}
                    error={error}
                    required={true}
                    type={type}
                    sx={{ m: 1, minWidth: 250 }}
                    onChange={(e) =>
                      handleFieldValueChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        { key: fieldKey, type }
                      )
                    }
                  >
                    {type === "select" && (
                      <MenuItem value={""} key="-">
                        {"--"}
                      </MenuItem>
                    )}
                    {type === "select" &&
                      buildings &&
                      buildings?.length > 0 &&
                      buildings?.map((building: IBuildingsDataApiModel) => (
                        <MenuItem value={building?.id} key={building?.id}>
                          {building?.name}
                        </MenuItem>
                      ))}
                  </TextField>
                }
              </Box>
            )
          )}
      </Box>
      <Button
        className="add-meeting-button"
        size="medium"
        onClick={submitMeetingDetails}
      >
        Next
      </Button>
    </>
  );
};

export default AddMeetingFormTemplate;
