const supplierAggregationPipeline = [
    {
        $group: {
            _id: "$supplier_id",
            totalProducts: { $sum: 1 }
        }
    }
];

module.exports = supplierAggregationPipeline;
