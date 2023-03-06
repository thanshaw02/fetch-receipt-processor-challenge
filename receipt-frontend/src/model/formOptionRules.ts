

export const formOptionRules = {
  retailer: { required: "Retailer name is required" },
  purchaseDate: { required: "Purchase date is required" },
  purchaseTime: { required: "Purchase time is required" },
  items: { 
    required: "Items are required",
    minLength: {
      value: 1,
      message: "A receipt must have at least one item"
    }
  },
  total: { required: "Total dollar amount is required" }
};

export default formOptionRules