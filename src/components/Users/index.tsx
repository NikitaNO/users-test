import * as React from 'react';
import { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  Icon,
  List,
  Breadcrumb,
  Segment,
  Image,
  Dimmer,
  Loader
} from 'semantic-ui-react';
import {
  fetchUsers,
  getUsers,
  getTasksAndAverage,
  setActiveUser,
  switchActiveTask
} from '../../store/modules/users';
import { IUser, ITask } from '../../api';

export interface IGreatUser
  extends IUser {
  isGreat: boolean;
}

export interface IUsers {
  users: IGreatUser[];
  tasks: ITask[];
  isLoading: boolean;
  activeUserId: number;
  selectedTasksAverage: number | null;
  activeTasks: {
    [key: string]: boolean;
  };
  fetchUsers();
  setActiveUser(userId: number | null);
  switchActiveTask(taskId: number);
}

const Container =
  styled.div`
    width: 70%;
    min-width: 600px;
    margin: 30px auto;
  `;

const ListItem =
  styled(List.Item)`
    cursor: pointer;
  `;

const Users = (props: IUsers) => {
  const {
    users,
    tasks,
    activeUserId,
    activeTasks,
    selectedTasksAverage,
    isLoading,
    fetchUsers,
    setActiveUser,
    switchActiveTask
  } = props;

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container>
      <Segment attached="top">
        <Breadcrumb size="large">
          <Breadcrumb.Section
            link
            active={!activeUserId}
            onClick={() => {
              setActiveUser(null);
            }}>
            Users
          </Breadcrumb.Section>
          <Breadcrumb.Divider icon="right chevron" />
          {
            activeUserId && (
              <Breadcrumb.Section link active>
                {
                  !selectedTasksAverage
                    ? 'Tasks'
                    : `Tasks, average: ${selectedTasksAverage}`
                }
              </Breadcrumb.Section>
            )
          }
        </Breadcrumb>
      </Segment>
      <Segment attached>
        {
          isLoading
            ? (
              <Fragment>
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
                <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
              </Fragment>
            )
            : activeUserId
              ? (
                <List divided relaxed="very">
                  {
                    tasks.map(task => (
                      <ListItem key={task.id} onClick={() => {
                        switchActiveTask(task.id);
                      }}>
                        <List.Icon
                          name="tasks"
                          size="large"
                          color={
                            activeTasks[task.id]
                              ? 'red'
                              : 'grey'
                          }
                          verticalAlign="middle" />
                        <List.Content>
                          <List.Header>{`${task.title} (${task.score})`}</List.Header>
                          <List.Description>
                            {task.description}
                          </List.Description>
                        </List.Content>
                      </ListItem>
                    ))
                  }
                </List>
              )
              : (
                <List divided relaxed="very">
                  {
                    users.map(user => (
                      <ListItem key={user.id} onClick={() => {
                        setActiveUser(user.id);
                      }}>
                        <List.Icon
                          name="user"
                          size="large"
                          color="grey"
                          verticalAlign="middle" />
                        <List.Content>
                          {`${user.firstName} ${user.lastName} (${user.age} y.o.)`}
                          &nbsp;&nbsp;
                          {
                            user.isGreat && (
                              <Icon name="check" color="teal" />
                            )
                          }
                        </List.Content>
                      </ListItem>
                    ))
                  }
                </List>
              )
        }
      </Segment>
    </Container>
  );
};

const mapState = state => ({
  ...getTasksAndAverage(state),
  users: getUsers(state),
  isLoading: state.users.isLoading,
  activeUserId: state.users.activeUserId,
  activeTasks: (
    state.users.activeTasksMap
      [state.users.activeUserId] || {}
  )
});

const enhance =
  connect(mapState, {
    fetchUsers,
    setActiveUser,
    switchActiveTask
  });

export default enhance(Users);
