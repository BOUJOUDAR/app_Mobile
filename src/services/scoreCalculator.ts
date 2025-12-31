export interface CalculationResult {
    score: number;
    matchingIndices: number[];
}

export function calculateScore(answersA: string[], answersB: string[]): CalculationResult {
    if (!answersA || !answersB || answersA.length === 0 || answersB.length === 0) {
        return { score: 0, matchingIndices: [] };
    }

    const matchingIndices: number[] = [];
    const matchCount = Math.min(answersA.length, answersB.length);

    for (let i = 0; i < matchCount; i++) {
        if (answersA[i] === answersB[i]) {
            matchingIndices.push(i);
        }
    }

    const matches = matchingIndices.length;
    const baseScore = (matches / matchCount) * 100;

    // Add slight randomness for fun (±3%)
    const variance = (Math.random() * 6) - 3;
    const finalScore = Math.round(Math.min(100, Math.max(0, baseScore + variance)));

    return {
        score: finalScore,
        matchingIndices
    };
}

