import React from "react";

const StatisticsOrders = () => {
  const totalOrders = 10;
  const favoriteDish = "Pizza";

  return (
    <div>
      <h2>Your Statistics</h2>
      <p>Total Orders: {totalOrders}</p>
      <p>Favorite Dish: {favoriteDish}</p>
    </div>
  );
};

export default StatisticsOrders;
