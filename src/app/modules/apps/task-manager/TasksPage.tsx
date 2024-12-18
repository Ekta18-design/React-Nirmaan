import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {TasksListWrapper} from './tasks-list/TasksList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Task Manager',
    path: '/apps/task-manager/tasks',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const TasksPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='tasks'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Task Manager</PageTitle>
              <TasksListWrapper/>
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/task-manager/tasks' />} />
    </Routes>
  )
}

export default TasksPage
