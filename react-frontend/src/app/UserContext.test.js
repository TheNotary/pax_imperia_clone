import {render} from '../../tools/test-utils';
import DebugPage from '../pages/DebugPage/DebugPage';
import { createUserContext } from './UserContext';

describe("UserContext tests", () => {

  test('userContext can get and set properties', () => {
    const userContext = createUserContext();

    // expect(userContext.displayName).toEqual('NONE');
    // expect(userContext.photoURL).toEqual('');
    // expect(userContext.email).toEqual('');
    // expect(userContext.login).toBeInstanceOf(Function);
    // expect(userContext.logout).toBeInstanceOf(Function);

    userContext.photoURL = 'photo url';
    expect(userContext.photoURL).toEqual('photo url');

    userContext.displayName = 'test name';
    expect(userContext.displayName).toEqual('test name');
  });

});

