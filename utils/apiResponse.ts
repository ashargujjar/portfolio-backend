export const ApiResponse = (success: boolean, message: string, data?: any) => {
  return { success, message, data };
};
