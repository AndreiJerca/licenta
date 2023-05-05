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

export const OverviewLatestProducts = (props) => {
  const { sells = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Latest sells" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nume produs</TableCell>
                <TableCell>Numar comenzi</TableCell>
                <TableCell sortDirection="desc">valoare totala</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sells.map((Sell) => {
                return (
                  <TableRow hover key={Sell.id}>
                    <TableCell>{Sell.numeProdus}</TableCell>
                    <TableCell>{Sell.nrComenzi}</TableCell>
                    <TableCell>{Sell.valTotala}</TableCell>
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

OverviewLatestProducts.prototype = {
  sells: PropTypes.array,
  sx: PropTypes.object,
};
