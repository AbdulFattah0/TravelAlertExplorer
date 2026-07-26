import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";

const Alert = ({ alert }) => {

  // Conditional rendering
  if (!alert) return (<></>);

  return (
    <Card sx={{ marginTop: "1em" }}>
      <CardHeader
        title={`${alert.country_name} (${alert.country_code})`}
        subheader={alert.sub_region || "N/A"}
      />

      <CardContent>
        <Divider sx={{ marginY: "0.75em" }} />

        <Typography variant="body1">
          {alert.advisory || "No advisory available."}
        </Typography>

        <Divider sx={{ marginY: "0.75em" }} />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginTop: "0.5em" }}
        >
          {alert.date || "N/A"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Alert;
