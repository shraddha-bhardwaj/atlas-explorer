export async function handleApiResponse(response) {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "API request failed");
  }
  return result.data;
}

export async function apiGet(url) {
  const response = await fetch(url);
  return handleApiResponse(response);
}

export async function apiPost(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleApiResponse(response);
}
