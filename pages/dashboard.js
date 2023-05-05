import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { OverviewBudget } from "sections/overview/overview-budget";
import { OverviewLatestOrders } from "sections/overview/overview-latest-orders";
import { OverviewSales } from "sections/overview/overview-sales";
import { OverviewTasksProgress } from "sections/overview/overview-tasks-progress";
import { OverviewTotalCustomers } from "sections/overview/overview-total-customers";
import { OverviewTotalProfit } from "sections/overview/overview-total-profit";
import { OverviewLatestProducts } from "sections/overview/overview-latest-products.js";
import Stripe from "stripe";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { useSession } from "next-auth/react";

const now = new Date();

export async function getServerSideProps() {
  const stripe = new Stripe(process.env.STRIPE_SK);
  const { User } = require("@/models/User");
  const { Order } = require("@/models/Order");
  const { Product } = require("@/models/Product");
  const users = await User.find({}, null, { sort: { _id: -1 } });
  const orders = await Order.find({}, null, { sort: { _id: -1 } });
  const products = await Product.find({}, null, { sort: { _id: -1 } });
  await mongooseConnect();
  const balanceTransactions = await stripe.balanceTransactions.list({
    limit: 100,
  });

  // const balance = await stripe.balance.retrieve();
  // const customers = await User.find({}, null, {
  //   sort: { _id: -1 },
  //   limit: 20,
  // });

  // console.log("HEREEEEEEEEEEEEEEEEEE");
  // console.log(balanceTransactions);
  // console.log(balance);
  // console.log(customers);
  const sellAmmounts = balanceTransactions.data.map(
    (el) => el.amount / el.exchange_rate - el.fee
  );
  const totalProfit = sellAmmounts.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const clientNumber = users.length;
  const productsNumber = products.length;
  let payStatistic = balanceTransactions.data.map((el) => {
    return {
      year: new Date(el.created * 1000).getFullYear(),
      month: new Date(el.created * 1000).getMonth() + 1,
      paidValue: Math.round(el.amount / el.exchange_rate - el.fee) / 100,
    };
  });

  let monthlySales = new Array(12).fill(0);
  for (let i = 0; i < payStatistic.length; i++) {
    monthlySales[payStatistic[i].month] += payStatistic[i].paidValue;
  }

  monthlySales = monthlySales.map((el) => Math.round(el * 100) / 100);

  let PaymentsAudit = [];
  for (let i = 0; i < payStatistic.length; i++) {
    const year = payStatistic[i].year;
    const month = payStatistic[i].month;
    let found = PaymentsAudit.find(
      (el) => el.year == year && el.month == month
    );
    // console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    // console.log(year, month, found, PaymentsAudit);

    if (found) {
      found.valTot += payStatistic[i].paidValue;
      found.nrComenzi += 1;
    } else {
      PaymentsAudit.push({
        year: year,
        month: month,
        valTot: payStatistic[i].paidValue,
        nrComenzi: 1,
      });
    }
  }

  PaymentsAudit = PaymentsAudit.map((el) => {
    return { ...el, valTot: Math.round(el.valTot * 100) / 100 };
  });
  PaymentsAudit.sort((a, b) => {
    // a is less than b by some ordering criterion
    if (a.year < b.year || (a.year == b.year && a.month < b.month)) {
      return -1;
    }
    // a is greater than b by the ordering criterion
    if (a.year > b.year || (a.year == b.year && a.month > b.month)) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });
  //Mapam toate comenzile pentru a afla de cate ori a fost comandat un produs in ultima perioada
  const getCountByProduct = (title) => {
    let count = 0;
    orders.map((order) => {
      order?.line_items.forEach((lineItem) => {
        if (lineItem.price_data?.product_data?.name === title)
          count += lineItem?.quantity;
      });
    });
    return count;
  };
  const mappedProducts = products.filter(
    (product) => getCountByProduct(product?.title) !== 0
  );
  console.log(mappedProducts);
  const AuditProducts = mappedProducts.map((prod) => {
    let count = getCountByProduct(prod?.title);
    return {
      numeProdus: prod?.title,
      nrComenzi: count,
      valTotala: count * prod?.price,
    };
  });
  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
      orders: JSON.parse(JSON.stringify(orders)),
      balanceTransactions: JSON.parse(JSON.stringify(balanceTransactions)),
      totalProfit: JSON.parse(JSON.stringify(Math.round(totalProfit) / 100)),
      clientNumber: JSON.parse(JSON.stringify(clientNumber)),
      productsNumber: JSON.parse(JSON.stringify(productsNumber)),
      monthlySales: JSON.parse(JSON.stringify(monthlySales)),
      PaymentsAudit: JSON.parse(JSON.stringify(PaymentsAudit)),
      AuditProducts: JSON.parse(JSON.stringify(AuditProducts)),
    },
  };
}

const Dashboard = ({
  users,
  orders,
  balanceTransactions,
  totalProfit,
  clientNumber,
  productsNumber,
  monthlySales,
  PaymentsAudit,
  AuditProducts,
}) => {
  // console.log(users);
  // console.log(orders);
  //console.log(balanceTransactions);
  // console.log();
  const adminEmails = ["andrei.jerca00@e-uvt.ro"];

  const { data: session } = useSession();
  if (!adminEmails.includes(session?.user?.email)) {
    return (
      <>
        <div
          style={{
            width: " 100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            color: "red",
          }}
        >
          n-ai voie
        </div>
      </>
    );
  }
  return (
    <>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                difference={12}
                positive
                sx={{ height: "100%" }}
                numberOfCommands={orders.length}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalCustomers
                difference={16}
                positive={false}
                sx={{ height: "100%" }}
                value={JSON.stringify(clientNumber)}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTasksProgress
                sx={{ height: "100%" }}
                value={productsNumber}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalProfit
                sx={{ height: "100%" }}
                value={`${totalProfit}$`}
              />
            </Grid>
            <Grid xs={12} lg={8}>
              <OverviewSales
                chartSeries={[
                  {
                    name: "Vanzari",
                    data: monthlySales,
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid>

            <Grid xs={12} md={12} lg={8}>
              <OverviewLatestOrders
                sells={PaymentsAudit}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={12} lg={8}>
              <OverviewLatestProducts
                sells={AuditProducts}
                sx={{ height: "100%" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
