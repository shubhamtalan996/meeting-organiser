import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import "./AddMeeting.Styles.scss";
// import MomentUtils from "@date-io/moment";

// import {
//   KeyboardDatePicker,
//   KeyboardTimePicker,
//   MuiPickersUtilsProvider,
// } from "@material-ui/pickers";
import { useQuery, useMutation } from "graphql-hooks";
import { BUILDINGS_DATA_QUERY } from "../../utils/api/gql-queries/add-meeting-gql-query";
// import Modal from "@mui/material/Modal";
// import Fade from "@mui/material/Fade";
// import Dropdown from "react-dropdown";
// import "react-dropdown/style.css";
// import {
//   ADD_MEETING,
//   MEETING_QUERY,
//   MEETING_ROOM_QUERY,
// } from "../../utils/api/gql-queries/add-meeting-gql-query";
// import { BUILDING_QUERY } from "../Home";

type IFormFieldsKeys =
  | "title"
  | "selectedDate"
  | "startTime"
  | "endTime"
  | "building";

type IFormFieldsTypes = "textfield" | "date" | "datetime-local" | "select";

type IFormKeysAndTypes = {
  key: string;
  type: IFormFieldsTypes;
};

type IInputFieldsModel = {
  label: string;
  type: IFormFieldsTypes;
  value?: Date | string | number;
  error?: boolean;
};

type IMeetingRoomForm = {
  [x in IFormFieldsKeys]: IInputFieldsModel;
};

let getDefaultMeetingRoomForm = (): IMeetingRoomForm => ({
  title: {
    label: "Title",
    type: "textfield",
    value: "",
    error: false,
  },
  selectedDate: {
    label: "Selected Date",
    type: "date",
    value: +new Date(),
    error: false,
  },
  startTime: {
    label: "Start Time",
    type: "datetime-local",
    value: +new Date(),
    error: false,
  },
  endTime: {
    label: "End Time",
    type: "datetime-local",
    value: +new Date(),
    error: false,
  },
  building: {
    label: "Building",
    type: "select",
    value: "",
    error: false,
  },
});

const AddMeeting = () => {
  const [meetingRoomForm, setMeetingRoomForm] = useState<IMeetingRoomForm>(
    getDefaultMeetingRoomForm()
  );

  const handleFieldValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    { key, type }: IFormKeysAndTypes
  ) => {
    const tempField: IInputFieldsModel = {
      ...meetingRoomForm[key as IFormFieldsKeys],
    };

    if (type !== "select") {
      tempField.value = e.currentTarget.value;
    } else {
    }

    console.log(e.currentTarget.value);
    setMeetingRoomForm((prevFormState) => ({
      ...prevFormState,
      [key]: tempField,
    }));
  };

  //   let navigate = useNavigate();
  //   const [AddMeeting] = useMutation(ADD_MEETING);
  const { data: buildingsData } = useQuery(BUILDINGS_DATA_QUERY);

  //   console.log(buildingsData);

  //   const [meetingRoomSpecs, setMeetingRoomSpecs] = useState(getDefaultSpecs());

  //   const [vacantRooms, setVacantRooms] = useState([]);
  //   const [modalConfig, setModalConfig] = useState({
  //     open: false,
  //   });
  //   const [title, setTitle] = useState("New Meeting");
  //   const [building, setBuilding] = useState();

  //   const { data: buildingData } = useQuery(BUILDING_QUERY);
  //   const { data: meetingRoomData } = useQuery(MEETING_ROOM_QUERY, {
  //     variables: { id: building?.value },
  //   });

  //   const options = (list) => {
  //     let buildingOptions = list
  //       ? list.map((item) => ({ label: item.name, value: item.id }))
  //       : [];
  //     return buildingOptions;
  //   };

  const validateMeetingDetailsForm = (): boolean => {
    let isValid = true;

    Object.entries(meetingRoomForm).forEach(([key, fieldData]) => {
      if (!fieldData?.value) {
        isValid = false;
        const tempField: any = { ...fieldData[key] };
        tempField.error = true;
        setMeetingRoomForm((prevSpecs) => ({
          ...prevSpecs,
          [key]: tempField,
        }));
      }
    });
    return isValid;
  };

  //   const isMeetingClashing = (meeting, meetingRoomSpecs) => {
  //     const meetingDate = meeting?.date;

  //     /* As Date coming from API is in same format */
  //     const requiredDateEpoch = new Date(
  //       meetingRoomSpecs?.selectedDate?.value
  //     ).toLocaleDateString();

  //     let meetingStartTimeSeconds;
  //     let meetingEndTimeSeconds;

  //     if (meeting?.startTime) {
  //       const [hours, minutes] = meeting?.startTime.split(":");
  //       if (Number(hours) > 0) meetingStartTimeSeconds = hours * 60 * 60;

  //       if (Number(minutes) > 0) meetingStartTimeSeconds += minutes * 60;
  //     }
  //     if (meeting?.endTime) {
  //       const [hours, minutes] = meeting?.endTime.split(":");
  //       if (Number(hours) > 0) meetingEndTimeSeconds = hours * 60 * 60;

  //       if (Number(minutes) > 0) meetingEndTimeSeconds += minutes * 60;
  //     }

  //     const todaysEpoch = +new Date(`${new Date().toDateString()}`);

  //     const requiredStartTimeEpoch = Math.floor(
  //       (Number(+new Date(meetingRoomSpecs?.startTime?.value)) -
  //         Number(todaysEpoch)) /
  //         1000
  //     );
  //     const requiredEndTimeEpoch = Math.floor(
  //       (Number(+new Date(meetingRoomSpecs?.endTime?.value)) -
  //         Number(todaysEpoch)) /
  //         1000
  //     );

  //     return (
  //       meetingDate === requiredDateEpoch &&
  //       ((requiredStartTimeEpoch > meetingStartTimeSeconds &&
  //         requiredStartTimeEpoch < meetingEndTimeSeconds) ||
  //         (requiredEndTimeEpoch > meetingStartTimeSeconds &&
  //           requiredEndTimeEpoch < meetingEndTimeSeconds))
  //     );
  //   };

  //   const getAvailableRooms = () => {
  //     let freeMeetingRooms = [];

  //     if (meetingRoomData?.Building) {
  //       const { meetingRooms } = meetingRoomData?.Building ?? [];

  //       if (meetingRooms && meetingRooms?.length) {
  //         meetingRooms.forEach((meetingRoom) => {
  //           const { meetings } = meetingRoom;
  //           let isMeetingRoomAvailable = true;
  //           if (meetings && meetings?.length) {
  //             meetings.forEach((meeting) => {
  //               if (isMeetingClashing(meeting, meetingRoomSpecs)) {
  //                 isMeetingRoomAvailable = false;
  //               }
  //             });
  //           }
  //           if (isMeetingRoomAvailable) {
  //             freeMeetingRooms.push(meetingRoom);
  //           }
  //         });
  //       }
  //     }
  //     return freeMeetingRooms;
  //   };

  const submitMeetingDetails = () => {
    if (validateMeetingDetailsForm()) {
      setVacantRooms(getAvailableRooms());
      setModalConfig((prevConfig) => ({ ...prevConfig, open: true }));
    }
  };

  //   const handleMeetingDataInput = (data, key) => {
  //     let updatedSpecs = { ...meetingRoomSpecs };
  //     switch (key) {
  //       case "endTime":
  //         updatedSpecs.endTime.value = data;
  //         updatedSpecs.endTime.error = data <= meetingRoomSpecs?.startTime?.value;
  //         updatedSpecs.startTime.error =
  //           data <= meetingRoomSpecs?.startTime?.value;

  //         break;

  //       case "startTime":
  //         updatedSpecs.startTime.value = data;
  //         updatedSpecs.startTime.error = data >= meetingRoomSpecs?.endTime?.value;
  //         updatedSpecs.endTime.error = data >= meetingRoomSpecs?.endTime?.value;
  //         break;

  //       default:
  //         updatedSpecs[key].value = data;
  //     }

  //     setMeetingRoomSpecs(updatedSpecs);
  //   };

  //   const bookMeetingRoom = () => {
  //     if (modalConfig?.selectedCardId) {
  //       const payload = {
  //         id: Number(MeetingsData?.Meetings?.length) + 1,
  //         title: title || "New Meeting",
  //         startTime: meetingRoomSpecs?.startTime?.value
  //           ? `${new Date(
  //               meetingRoomSpecs.startTime.value
  //             ).getHours()}:${new Date(
  //               meetingRoomSpecs.startTime.value
  //             ).getMinutes()}`
  //           : "",
  //         endTime: meetingRoomSpecs?.endTime.value
  //           ? `${new Date(meetingRoomSpecs.endTime.value).getHours()}:${new Date(
  //               meetingRoomSpecs.endTime.value
  //             ).getMinutes()}`
  //           : "",
  //         meetingRoomId: modalConfig?.selectedCardId,
  //         date: new Date(
  //           meetingRoomSpecs?.selectedDate?.value
  //         ).toLocaleDateString(),
  //       };
  //       AddMeeting({
  //         variables: payload,
  //       })
  //         .then((data) => {
  //           navigate("/home");
  //         })
  //         .catch(() => {});
  //     }
  //   };

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
                      buildingsData?.Buildings?.map((building: any) => (
                        <MenuItem value={building?.id} key={building?.id}>
                          {building?.name}
                        </MenuItem>
                      ))}
                  </TextField>
                }
              </Box>
            )
          )}
        {/* <div className="label-container">
          <div className="label"> Meeting Title</div>
          <div className="label">Date</div>
          <div className="label"> Start Time</div>
          <div className="label"> End Time</div>
          <div className="label"> Select Building</div>
        </div>
        <div className="input-fields">
          <input
            name="title"
            className="title-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              disablePast={true}
              autoOk
              variant="inline"
              inputVariant="outlined"
              format="	
              DD/MM/YY"
              value={meetingRoomSpecs?.selectedDate?.value}
              error={meetingRoomSpecs?.selectedDate?.error}
              InputAdornmentProps={{ position: "start" }}
              onChange={(data) => handleMeetingDataInput(data, "selectedDate")}
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              error={meetingRoomSpecs?.startTime?.error}
              value={meetingRoomSpecs?.startTime?.value}
              onChange={(data) => handleMeetingDataInput(data, "startTime")}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              error={meetingRoomSpecs?.endTime?.error}
              value={meetingRoomSpecs?.endTime?.value}
              onChange={(data) => handleMeetingDataInput(data, "endTime")}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
            />
          </MuiPickersUtilsProvider>

          <Dropdown
            options={options(buildingData?.Buildings || [])}
            onChange={(option) => {
              setBuilding(option);
            }}
            placeholder="Select an option"
          />
        </div>
      </div>
      <div className="common btn">
        <button
          className={building ? "next-button" : "disabled-button"}
          onClick={submitMeetingDetails}
          type="button"
        >
          Next
        </button>
      </Box>
      {modalConfig.open && (
        <Modal
          open={modalConfig.open}
          onClose={() =>
            setModalConfig((prevConfig) => ({ ...prevConfig, open: false }))
          }
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Fade in={modalConfig.open}>
            <div className="modalWrapper">
              <h2>Please select one of the free rooms</h2>
              {vacantRooms &&
                vacantRooms?.length &&
                vacantRooms.map(({ name, building, floor, id }) => (
                  <div
                    className={`roomDetailsWrapper ${
                      modalConfig?.selectedCardId === id ? "selected" : ""
                    }`}
                    onClick={() =>
                      setModalConfig((prevConfig) => ({
                        ...prevConfig,
                        selectedCardId: id,
                      }))
                    }
                  >
                    <h3>{name}</h3>
                    <p>{building?.name}</p>
                    <p>{`Floor: ${floor}`}</p>
                  </div>
                ))}
              <button onClick={bookMeetingRoom}>Save</button>
            </div>
          </Fade>
        </Modal>
      )} */}
      </Box>
      <button onClick={submitMeetingDetails} type="button">
        Next
      </button>
    </div>
  );
};
export default AddMeeting;
