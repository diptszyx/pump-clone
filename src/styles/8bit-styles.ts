/**
 * Shared 8-bit retro styles for consistent UI across the application
 */

export interface EightBitCardStyleOptions {
  backgroundColor?: string;
  padding?: string;
  width?: string;
  height?: string;
  margin?: string;
  display?: string;
  alignItems?: string;
  justifyContent?: string;
  borderSize?: "small" | "medium" | "large";
}

/**
 * Base 8-bit card style with green accent border
 */
export const getEightBitCardStyle = (
  options: EightBitCardStyleOptions = {}
) => {
  const {
    backgroundColor = "#1a202c",
    padding,
    width,
    height,
    margin,
    display,
    alignItems,
    justifyContent,
    borderSize = "medium",
  } = options;

  // Different border sizes for different use cases
  const borderSizes = {
    small: {
      boxShadow: `
        2px 0 #333,
        -2px 0 #333,
        0 -2px #333,
        0 2px #333,
        4px 0 #333,
        -4px 0 #333,
        0 -4px #333,
        0 4px #333,
        6px 0 #333,
        -6px 0 #333,
        0 -6px #333,
        0 6px #333,
        8px 0 #333,
        -8px 0 #333,
        0 -8px #333,
        0 8px #333,
        10px 0 #059669,
        -10px 0 #059669,
        0 -10px #059669,
        0 10px #059669,
        0 0 0 2px #333,
        0 0 0 4px #333,
        0 0 0 6px #059669
      `,
    },
    medium: {
      boxShadow: `
        4px 0 #333,
        -4px 0 #333,
        0 -4px #333,
        0 4px #333,
        8px 0 #333,
        -8px 0 #333,
        0 -8px #333,
        0 8px #333,
        12px 0 #333,
        -12px 0 #333,
        0 -12px #333,
        0 12px #333,
        16px 0 #333,
        -16px 0 #333,
        0 -16px #333,
        0 16px #333,
        20px 0 #059669,
        -20px 0 #059669,
        0 -20px #059669,
        0 20px #059669,
        0 0 0 4px #333,
        0 0 0 8px #333,
        0 0 0 12px #059669
      `,
    },
    large: {
      boxShadow: `
        4px 0 #333,
        -4px 0 #333,
        0 -4px #333,
        0 4px #333,
        8px 0 #333,
        -8px 0 #333,
        0 -8px #333,
        0 8px #333,
        12px 0 #333,
        -12px 0 #333,
        0 -12px #333,
        0 12px #333,
        16px 0 #333,
        -16px 0 #333,
        0 -16px #333,
        0 16px #333,
        20px 0 #333,
        -20px 0 #333,
        0 -20px #333,
        0 20px #333,
        24px 0 #059669,
        -24px 0 #059669,
        0 -24px #059669,
        0 24px #059669,
        0 0 0 4px #333,
        0 0 0 8px #333,
        0 0 0 12px #333,
        0 0 0 16px #059669
      `,
    },
  };

  return {
    ...borderSizes[borderSize],
    backgroundColor,
    borderRadius: "0px",
    border: "none",
    ...(padding && { padding }),
    ...(width && { width }),
    ...(height && { height }),
    ...(margin && { margin }),
    ...(display && { display }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
  };
};

/**
 * Predefined styles for common use cases
 */
export const eightBitStyles = {
  // Style cho token cards (TokenPage, TokenList, etc.)
  tokenCard: getEightBitCardStyle({
    backgroundColor: "#1a202c",
    borderSize: "small",
  }),

  // Style cho stats cards
  statsCard: getEightBitCardStyle({
    backgroundColor: "#333",
    borderSize: "medium",
    padding: "12px 8px",
    width: "150px",
    height: "80px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),

  // Style cho form cards
  formCard: getEightBitCardStyle({
    backgroundColor: "#1a202c",
    borderSize: "small",
  }),

  // Style cho preview cards
  previewCard: getEightBitCardStyle({
    backgroundColor: "#1a202c",
    borderSize: "small",
  }),
};

/**
 * 8-bit input style với viền màu xám
 */
export const getEightBitInputStyle = (focused: boolean = false) => {
  return {
    boxShadow: `
      2px 0 #666,
      -2px 0 #666,
      0 -2px #666,
      0 2px #666,
      4px 0 ${focused ? "#059669" : "#666"},
      -4px 0 ${focused ? "#059669" : "#666"},
      0 -4px ${focused ? "#059669" : "#666"},
      0 4px ${focused ? "#059669" : "#666"},
      0 0 0 2px ${focused ? "#059669" : "#666"}
    `,
    backgroundColor: "#0f111a",
    borderRadius: "0px",
    border: "none",
    outline: "none",
  };
};
