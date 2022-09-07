import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./AddMeeting.Styles.scss";
import { useMutation, useManualQuery } from "graphql-hooks";
import { AppRootContext } from "../../context/AppRootContext";
import {
  ADD_MEETING_QUERY,
  BUILDINGS_DATA_QUERY,
  MEETING_QUERY,
} from "../../utils/api/gql-queries/add-meeting-gql-query";
import { IMeetingRoomsApiModel } from "../../interfaces/api-interfaces/buildings-api-interface";
import RoomSelectorModal from "../../components/Templates/RoomSelectorModal";
import { getDefaultMeetingRoomForm } from "../../configs/pagesModuleConfigs/AddMeetingConfig";
import {
  IMeetingRoomForm,
  IModelConfig,
} from "../../interfaces/module-interfaces/add-meeting-interface";
import { dateFieldToLocaleDate } from "../../utils/api/tools";
import AddMeetingFormTemplate from "../../components/Templates/AddMeetingFormTemplate";

const AddMeeting: React.FC = () => {
  /** Variables **/
  const {
    appRootState: { snackbar },
  } = useContext(AppRootContext);

  const [meetingRoomForm, setMeetingRoomForm] = useState<IMeetingRoomForm>(
    getDefaultMeetingRoomForm()
  );

  const navigate = useNavigate();

  const [modalConfig, setModalConfig] = useState<IModelConfig>({
    open: false,
    rooms: [],
  });

  /** Queries and hooks initializations **/
  const [fetchBuildings, { data: buildingsData }] =
    useManualQuery(BUILDINGS_DATA_QUERY);
  const [fetchMeetings, { data: MeetingsData }] = useManualQuery(MEETING_QUERY);
  const [addMeetingRequest] = useMutation(ADD_MEETING_QUERY);

  /** Submit form details **/
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
      snackbar("No Rooms Available", "error");
    }
  };

  const handleModalStateFromForm = (
    open: boolean,
    rooms: IMeetingRoomsApiModel[]
  ) => {
    setModalConfig((prevState) => ({
      ...prevState,
      open,
      rooms,
    }));
  };

  /** Lifecycle hooks dependent calls**/

  useEffect(() => {
    fetchBuildings();
    fetchMeetings();
  }, [fetchBuildings, fetchMeetings]);

  return (
    <div className="add-meeting-container">
      <h1>Add Meeting</h1>
      <AddMeetingFormTemplate
        meetingRoomForm={meetingRoomForm}
        handleMeetingRoomForm={setMeetingRoomForm}
        buildings={buildingsData?.Buildings ?? []}
        handleModalState={handleModalStateFromForm}
      />

      {modalConfig.open && (
        <RoomSelectorModal
          modalConfig={modalConfig}
          handleClose={() =>
            setModalConfig((prevConfig) => ({ ...prevConfig, open: false }))
          }
          vacantRooms={modalConfig?.rooms}
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
