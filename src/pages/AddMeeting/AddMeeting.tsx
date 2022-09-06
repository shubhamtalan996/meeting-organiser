import React, { useEffect, useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import "./AddMeeting.Styles.scss";
import { useQuery, useMutation, useManualQuery } from "graphql-hooks";
import {
  ADD_MEETING,
  BUILDINGS_DATA_QUERY,
  MEETING_QUERY,
} from "../../utils/api/gql-queries/add-meeting-gql-query";
import {
  IBuildingsDataApiModel,
  IMeetingRoomsApiModel,
  IShowSnackBar,
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

  //will make this centeralized  state throughout the app
  const [showSnackBar, setShowSnackBar] = useState<IShowSnackBar>();

  const [modalConfig, setModalConfig] = useState<IModelConfig>({
    open: false,
  });

  const [fetchBuildings, { data: buildingsData }] =
    useManualQuery(BUILDINGS_DATA_QUERY);
  const [fetchMeetings, { data: MeetingsData }] = useManualQuery(MEETING_QUERY);

  //   const { data: buildingsData } = useQuery(BUILDINGS_DATA_QUERY);
  //   const { data: MeetingsData } = useQuery(MEETING_QUERY);

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
      if (
        buildingsData?.Buildings &&
        buildingsData?.Buildings?.length &&
        meetingRoomForm?.building?.value
      ) {
        const building = buildingsData?.Buildings.find(
          ({ id, ...rest }: IBuildingsDataApiModel) =>
            id === Number(meetingRoomForm?.building?.value)
        );
        setVacantRooms(getAvailableRooms(building, meetingRoomForm));
      }
      setModalConfig((prevConfig: IModelConfig) => ({
        ...prevConfig,
        open: true,
      }));
    }
  };

  const bookMeetingRoom = () => {
    if (modalConfig?.selectedCardId) {
      const payload = {
        id: Number(MeetingsData?.Meetings?.length) + 1,
        title: meetingRoomForm?.title?.value ?? "New Meeting",
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
    } else {
      setShowSnackBar({
        open: true,
        message: "No Rooms Available",
        severity: "error",
      } as IShowSnackBar);
    }
  };

  useEffect(() => {
    fetchBuildings();
    fetchMeetings();
  }, [fetchBuildings, fetchMeetings]);

  return (
    <div className="add-meeting-container">
      <Snackbar
        open={showSnackBar?.open}
        autoHideDuration={6000}
        onClose={() =>
          setShowSnackBar({ open: false, message: "" } as IShowSnackBar)
        }
        message={showSnackBar?.message}
      >
        <Alert
          onClose={() =>
            setShowSnackBar({ open: false, message: "" } as IShowSnackBar)
          }
          severity={showSnackBar?.severity}
        >
          {showSnackBar?.message}
        </Alert>
      </Snackbar>
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
                          <MenuItem value={building?.id} key={building?.id}>
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
