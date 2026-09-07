import pandas as pd
import os


def analyze_sales_data(file_path):

    extension = os.path.splitext(file_path)[1].lower()

    # Read CSV or Excel
    if extension == ".csv":
        df = pd.read_csv(file_path)

    elif extension in [".xlsx", ".xls"]:
        df = pd.read_excel(file_path)

    else:
        raise ValueError("Unsupported file format.")

    # Calculate revenue
    df["Revenue"] = df["Quantity"] * df["Price"]

    total_revenue = df["Revenue"].sum()
    total_orders = len(df)
    total_items = df["Quantity"].sum()

    average_order_value = (
        total_revenue / total_orders
        if total_orders > 0
        else 0
    )

    product_revenue = (
        df.groupby("Product")["Revenue"]
        .sum()
        .sort_values(ascending=False)
    )

    best_product = product_revenue.index[0]
    best_product_revenue = product_revenue.iloc[0]

    worst_product = product_revenue.index[-1]
    worst_product_revenue = product_revenue.iloc[-1]

    return {
        "total_revenue": round(float(total_revenue), 2),
        "total_orders": int(total_orders),
        "total_items_sold": int(total_items),
        "average_order_value": round(float(average_order_value), 2),
        "best_product": best_product,
        "best_product_revenue": round(float(best_product_revenue), 2),
        "worst_product": worst_product,
        "worst_product_revenue": round(float(worst_product_revenue), 2),
        "products": product_revenue.round(2).to_dict()
    }
    