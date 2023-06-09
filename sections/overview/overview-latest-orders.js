import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "components/scrollbar";

const statusMap = {
  pending: "warning",
  delivered: "success",
  refunded: "error",
};

export const OverviewLatestOrders = (props) => {
  const { sells = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Situatie Vanzari" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>An</TableCell>
                <TableCell>Luna</TableCell>
                <TableCell sortDirection="desc">valoare totala</TableCell>
                <TableCell>numar comenzi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sells.map((Sell) => {
                return (
                  <TableRow hover key={Sell.id}>
                    <TableCell>{Sell.year}</TableCell>
                    <TableCell>{Sell.month}</TableCell>
                    <TableCell>{Sell.valTot}</TableCell>
                    <TableCell>{Sell.nrComenzi}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewLatestOrders.prototype = {
  sells: PropTypes.array,
  sx: PropTypes.object,
};
