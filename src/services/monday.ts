import mondaySdk from "monday-sdk-js";
export const monday = mondaySdk();

type Processor = (any) => any;

export const api = async (query: string, processor?: Processor) => {
  let response = null;
  try {
    response = await monday.api(query);
  } catch (error) {
    console.log("monday.api error");
    console.error(error);
    return error;
  }

  if (response.errorMessage) {
    console.error(response.errorMessage);
  }

  try {
    if (typeof processor === "function") {
      return processor(response);
    } else {
      return response;
    }
  } catch (error) {
    console.log("Processor error", response);
    console.error(error);
  }
};
