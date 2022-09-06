import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import LabelCard from "../../Molecules/LabelCard";
import { IMeetingRoomsApiModel } from "../../../interfaces/api-interfaces/buildings-api-interface";
import { IModelConfig } from "../../../interfaces/module-interfaces/add-meeting-interface";
import "./AddMeetingModal.Styles.scss";

interface IAddMeetingModal {
  modalConfig?: IModelConfig;
  handleClose?: () => void;
  vacantRooms?: IMeetingRoomsApiModel[];
  handleCardClick?: (id?: string) => void;
  bookMeeting?: () => void;
}

const AddMeetingModal = ({
  modalConfig,
  handleClose,
  vacantRooms,
  handleCardClick,
  bookMeeting,
}: IAddMeetingModal) => {
  return (
    <Modal
      open={modalConfig?.open ?? false}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Fade in={modalConfig?.open}>
        <div className="modal-wrapper">
          <h1>Please select one of the free rooms</h1>
          {vacantRooms && vacantRooms?.length > 0 ? (
            vacantRooms.map(({ name, building, floor, id }, index) => (
              <LabelCard
                id={`${id || index}`}
                className={`room-card ${
                  modalConfig?.selectedCardId === id && "selected"
                }`}
                label={name}
                subTexts={[
                  {
                    key: `${building?.id}`,
                    label: `Building: `,
                    value: building?.name ?? "",
                  },
                  {
                    key: "floor",
                    label: `Floor: `,
                    value: floor ?? "",
                  },
                ]}
                handleClick={() => {
                  if (handleCardClick) handleCardClick(id);
                }}
              />
            ))
          ) : (
            <LabelCard
              id="fallback"
              className="room-card fallback"
              label={"Sorry,"}
              subTexts={[
                {
                  key: "message",
                  label: "There are no available rooms in this building",
                },
              ]}
            />
          )}
          <Button
            className="add-meeting-button"
            size="medium"
            onClick={() => {
              if (bookMeeting) bookMeeting();
            }}
          >
            Next
          </Button>
        </div>
      </Fade>
    </Modal>
  );
};

export default AddMeetingModal;
