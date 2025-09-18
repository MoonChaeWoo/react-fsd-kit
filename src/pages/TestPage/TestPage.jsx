import {useState, useEffect, useActionState} from 'react';
import axios from 'axios';
import {Button} from '../../shared/ui/Button'
import {Input} from '../../shared/ui/Input'


const increment = (previousState, formData) => {
    return previousState + 1;
};

const fetchJson = async (previousState, formData) => {
    const data = Object.fromEntries(formData.entries());
    const res = await axios.post('https://jsonplaceholder.typicode.com/posts', data);
    return JSON.stringify(res.data);
};

const TestPage = () => {
    const [number, setNumber] = useState(0);
    const [state, formAction] = useActionState(increment, 0);
    const [apiState, formApiAction, isPending] = useActionState(fetchJson, null);

    const [value, setValue] = useState('');

    return (
        <div>
            <div>
                <div>{number}</div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setNumber(prev => prev + 1)}>click
                </button>
            </div>

            <div>
                <form>
                    {state}
                    <br/>
                    <Button formAction={formAction}>Increment</Button>
                </form>
            </div>

            <br/>
            <div>
                <div>{apiState}</div>
                <form action={formApiAction}>
                    <Input
                        name={'title'}
                        id={'title'}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    >title</Input>
                    <br/>
                    <Input name={'body'} id={'body'}>body</Input>
                    <br/>
                    <Input name={'userId'} id={'userId'}>userId</Input>
                    <br/>
                    <Button>{isPending ? '...로딩중' : '클릭'}</Button>
                </form>
            </div>
            {/*<div className="mb-4">*/}
            {/*    <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>*/}
            {/*    <input type="password" id="password"*/}
            {/*           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"*/}
            {/*           placeholder="Enter your password" required/>*/}
            {/*    <p className="text-red-500 text-sm mt-2 hidden" id="passwordError">Password is required.</p>*/}
            {/*</div>*/}
        </div>
    );
};

export default TestPage;