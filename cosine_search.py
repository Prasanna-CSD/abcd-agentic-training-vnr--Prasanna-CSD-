import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Sample document vectors
documents = {
    "doc1": np.array([1, 2, 3]),
    "doc2": np.array([2, 3, 4]),
    "doc3": np.array([10, 10, 10])
}

# Query vector
query = np.array([1, 2, 3])

# Compute cosine similarity
for name, vector in documents.items():
    score = cosine_similarity([query], [vector])[0][0]
    print(f"{name} similarity: {score}")