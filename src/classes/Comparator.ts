import { ResultChange } from '../types/ResultChange';

export class Comparator {
    public compare(currentResults: (string | null)[], referenceResults: (string | null)[]): ResultChange[] {
        const changes: ResultChange[] = [];

        currentResults.forEach((current, index) => {
            const reference = referenceResults[index];

            const hasChanged =
                index >= referenceResults.length ||
                (current !== reference && current !== '' && current !== null);

            if (hasChanged) {
                changes.push({
                    index,
                    value: current,
                    oldValue: reference ?? null
                });
            }
        });

        return changes;
    }

}
