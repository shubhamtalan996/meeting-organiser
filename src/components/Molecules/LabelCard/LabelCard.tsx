import { Typography, Box } from "@mui/material";
import { ISubText } from "../../../interfaces/module-interfaces/home-page-interface";
import "./LabelCard.Styles.scss";

export interface ILabelCardProps {
  id: string;
  label?: string;
  subTexts?: ISubText[];
  className?: string;
}

const LabelCard: React.FC<ILabelCardProps> = ({
  id,
  label,
  subTexts,
  className,
}) => {
  return (
    <Box
      component="div"
      display="flex"
      flexDirection="column"
      className={`cardWrapper ${className}`}
      key={id}
    >
      <Typography className="label">{label}</Typography>
      {subTexts &&
        subTexts?.length &&
        subTexts.map(({ key, label: subTextLabel, value }) => (
          <Typography
            key={key}
            className="value"
          >{`${subTextLabel}${value}`}</Typography>
        ))}
    </Box>
  );
};

export default LabelCard;
