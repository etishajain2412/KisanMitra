import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material'
import {
  Storefront,
  VideoLibrary,
  Forum,
  HistoryEdu,
  Cloud,
  Settings,
  Menu,
  ShoppingCart
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../LanguageSwitcher'

const MyNavbar = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Sidebar menu items
  const menuItems = [
    { text: 'Marketplace', icon: <Storefront />, path: '/marketplace' },
    { text: 'Videos', icon: <VideoLibrary />, path: '/videos' },
    { text: 'Live Forum', icon: <Forum />, path: '/forums' },
    { text: 'Success Stories', icon: <HistoryEdu />, path: '/stories' },
    { text: 'Weather ', icon: <Cloud />, path: '/weather' },
    { text: 'My Cart', icon: <ShoppingCart />, path: '/cart' }, // 🛒 Added My Cart
    { text: 'Settings', icon: <Settings />, path: '/settings' }
  ]

  return (
    <>
      {/* Navbar */}
      <Navbar expand='lg' className='navbar navbar-dark bg-dark'>
        <Container>
          {/* Sidebar Toggle Button in Navbar */}
          <IconButton onClick={toggleSidebar} className='text-white me-3'>
            <Menu fontSize='large' />
          </IconButton>

          {/* Brand Name */}
          <Navbar.Brand as={Link} to='/'>
            {t('brand')}
          </Navbar.Brand>

          {/* Language Switcher */}
          <LanguageSwitcher />

          <Navbar.Toggle aria-controls='navbar-nav' />
          <Navbar.Collapse id='navbar-nav'>
            <Nav className='ms-auto'>
              <Nav.Link as={Link} to='/'>
                {t('home')}
              </Nav.Link>
              {/* <Nav.Link as={Link} to="/weather">{t("weather")}</Nav.Link>
              <Nav.Link as={Link} to="/farming-tips">{t("farming_tips")}</Nav.Link> */}
              <Nav.Link as={Link} to='/profile'>
                {t('my_profile')}
              </Nav.Link>
            </Nav>
            <Button
              onClick={() => navigate('/login')}
              className='btn btn-primary ms-3'
            >
              {t('login')}
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className='btn btn-success ms-3'
            >
              {t('register')}
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Sidebar Drawer */}
      <Drawer anchor='left' open={sidebarOpen} onClose={toggleSidebar}>
        <List style={{ width: 250 }}>
          {menuItems.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              onClick={toggleSidebar} // Close sidebar on item click
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItem button>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </>
  )
}

export default MyNavbar
