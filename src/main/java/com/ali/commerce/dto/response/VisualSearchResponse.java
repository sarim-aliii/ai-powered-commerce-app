package com.ali.commerce.dto.response;

import java.util.List;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class VisualSearchResponse {
    @JsonProperty("similar_product_ids")
    private List<Long> similarProductIds;
}