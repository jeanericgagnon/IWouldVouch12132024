export async function fetchReferences() {
  try {
    const response = await fetch('/api/references');
    if (!response.ok) {
      throw new Error('Failed to fetch references');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching references:', error);
    throw error;
  }
}

export async function createReference(referenceData: any) {
  try {
    const response = await fetch('/api/references', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(referenceData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create reference');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating reference:', error);
    throw error;
  }
}

export async function updateReference(id: number, referenceData: any) {
  try {
    const response = await fetch(`/api/references/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(referenceData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update reference');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating reference:', error);
    throw error;
  }
}

export async function deleteReference(id: number) {
  try {
    const response = await fetch(`/api/references/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete reference');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting reference:', error);
    throw error;
  }
}