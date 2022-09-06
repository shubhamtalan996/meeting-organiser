import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import "./AddMeeting.Styles.scss";
import { useQuery, useMutation } from "graphql-hooks";
import {
  ADD_MEETING,
  BUILDINGS_DATA_QUERY,
  MEETING_QUERY,
} from "../../utils/api/gql-queries/add-meeting-gql-query";
import {
  IBuildingsDataApiModel,
  IMeetingRoomsApiModel,
} from "../../interfaces/api-interfaces/buildings-api-interface";
import {
  getAvailableRooms,
  isFieldValid,
} from "../../utils/api/api-transforms/buildings-api-transform";
import AddMeetingModal from "../../components/Templates/AddMeetingModal";
import { getDefaultMeetingRoomForm } from "../../configs/pagesModuleConfigs/AddMeetingConfig";
import {
  IFormFieldsKeys,
  IFormKeysAndTypes,
  IInputFieldsModel,
  IMeetingRoomForm,
  IModelConfig,
} from "../../interfaces/module-interfaces/add-meeting-interface";
import { dateFieldToLocaleDate } from "../../utils/api/tools";

const AddMeeting = () => {
  const [meetingRoomForm, setMeetingRoomForm] = useState<IMeetingRoomForm>(
    getDefaultMeetingRoomForm()
  );

  const [vacantRooms, setVacantRooms] = useState<IMeetingRoomsApiModel[]>([]);

  const [modalConfig, setModalConfig] = useState<IModelConfig>({
    open: false,
  });

  const { data: buildingsData } = useQuery(BUILDINGS_DATA_QUERY);
  const { data: MeetingsData } = useQuery(MEETING_QUERY);

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
  };

  let navigate = useNavigate();
  const [addMeetingRequest] = useMutation(ADD_MEETING);

  const updateFormWithKey = (
    key: IFormFieldsKeys,
    fieldData: IInputFieldsModel
  ) => {
    setMeetingRoomForm((prevSpecs) => ({
      ...prevSpecs,
      [key]: fieldData,
    }));
  };

  const validateMeetingDetailsForm = (): boolean => {
    let isValid = true;

    Object.entries(meetingRoomForm).forEach(([key, fieldData]) => {
      isValid = isFieldValid(
        key as IFormFieldsKeys,
        fieldData,
        meetingRoomForm
      );
      let tempFieldData: IInputFieldsModel = { ...fieldData };
      tempFieldData.error = !isValid;
      updateFormWithKey(key as IFormFieldsKeys, tempFieldData);
    });
    return isValid;
  };

  const submitMeetingDetails = () => {
    if (validateMeetingDetailsForm()) {
      if (buildingsData?.Buildings && buildingsData?.Buildings?.length) {
        setVacantRooms(
          getAvailableRooms(buildingsData?.Buildings, meetingRoomForm)
        );
      }
      setModalConfig((prevConfig: IModelConfig) => ({
        ...prevConfig,
        open: true,
      }));
    }
  };

  console.log(vacantRooms);

  const bookMeetingRoom = () => {
    if (modalConfig?.selectedCardId) {
      const payload = {
        id: Number(MeetingsData?.Meetings?.length) + 1,
        title: meetingRoomForm?.title ?? "New Meeting",
        startTime: meetingRoomForm?.startTime?.value,

        endTime: meetingRoomForm?.endTime?.value,
        meetingRoomId: modalConfig?.selectedCardId,
        date: dateFieldToLocaleDate(meetingRoomForm?.date?.value as string),
      };
      addMeetingRequest({
        variables: payload,
      })
        .then((data) => {
          navigate("/home");
        })
        .catch(() => {});
    }
  };

  return (
    <div className="add-meeting-container">
      <h1>Add Meeting</h1>
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
                      buildingsData &&
                      buildingsData?.Buildings?.length > 0 &&
                      buildingsData?.Buildings?.map(
                        (building: IBuildingsDataApiModel) => (
                          <MenuItem value={building?.name} key={building?.name}>
                            {building?.name}
                          </MenuItem>
                        )
                      )}
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
      {modalConfig.open && (
        <AddMeetingModal
          modalConfig={modalConfig}
          handleClose={() =>
            setModalConfig((prevConfig) => ({ ...prevConfig, open: false }))
          }
          vacantRooms={vacantRooms}
          handleCardClick={(id) =>
            setModalConfig((prevConfig) => ({
              ...prevConfig,
              selectedCardId: id,
            }))
          }
          bookMeeting={bookMeetingRoom}
        />
      )}
    </div>
  );
};
export default AddMeeting;
