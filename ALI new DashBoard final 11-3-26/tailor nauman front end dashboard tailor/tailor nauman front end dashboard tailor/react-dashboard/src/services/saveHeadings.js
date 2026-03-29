import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function saveHeadings(page, headings) {
    try {
        const res = await addDoc(collection(db, 'sellerDashboardweb'), {
            page,
            headings,
            timestamp: new Date()
        });
        console.log('saveHeadings: saved', page, res.id);
        return res.id;
    } catch (e) {
        console.error('saveHeadings: failed', page, e);
        throw e;
    }
}
