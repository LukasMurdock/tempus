import { Link } from 'remix';
import Container from '~/components/Container';

export default function Index() {
    return (
        <Container>
            <h1 className="text-3xl font-bold">Occurrence</h1>
            <Link to="/tasks">Tasks</Link>
            <Link to="/calendar">Calendar</Link>
        </Container>
    );
}
