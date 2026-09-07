from backend.ai_analyzer import generate_business_insights


sample_analysis = {
    "total_revenue": 22580,
    "total_orders": 10,
    "total_items_sold": 131,
    "average_order_value": 2258,
    "best_product": "Chicken Biryani",
    "best_product_revenue": 16250,
    "worst_product": "Paneer Biryani",
    "worst_product_revenue": 5720,
    "products": {
        "Chicken Biryani": 16250,
        "Fried Rice": 5760,
        "Paneer Biryani": 5720
    }
}


result = generate_business_insights(sample_analysis)

print("\n===== AI BUSINESS ANALYSIS =====\n")
print(result)