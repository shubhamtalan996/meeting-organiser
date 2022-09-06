import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "graphql-hooks";
import { toBuildingDataApiTransform } from "../../utils/api/api-transforms/buildings-api-transform";
import { BUILDINGS_DATA_QUERY } from "../../utils/api/gql-queries/add-meeting-gql-query";
import LabelCard from "../../components/Molecules/LabelCard";
import { getDefaultLabelCardFields } from "../../configs/pagesModuleConfigs/HomePageConfig";
import { ILabelCardFields } from "../../interfaces/module-interfaces/home-page-interface";
import "./Home.Styles.scss";

const Home: React.FC = () => {
  const [labelCardFields, setLabelCardFields] = useState<ILabelCardFields[]>(
    getDefaultLabelCardFields()
  );

  let navigate = useNavigate();

  const { data: buildingsData } = useQuery(BUILDINGS_DATA_QUERY);

  useEffect(() => {
    if (buildingsData && buildingsData?.Buildings?.length) {
      setLabelCardFields(
        toBuildingDataApiTransform(
          buildingsData?.Buildings,
          getDefaultLabelCardFields()
        )
      );
    }
  }, [buildingsData, setLabelCardFields]);

  return (
    <div className="home-page-container">
      <h1>Home</h1>
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {labelCardFields &&
          labelCardFields?.length > 0 &&
          labelCardFields.map(({ label, wrapperClass, subTexts, key }) => (
            <LabelCard
              id={key}
              label={label}
              className={wrapperClass}
              subTexts={subTexts}
            />
          ))}
        <Button
          className="add-meeting-button"
          onClick={() => {
            navigate("/add-meeting");
          }}
        >
          Add a meeting
        </Button>
      </Box>
    </div>
  );
};
export default Home;
