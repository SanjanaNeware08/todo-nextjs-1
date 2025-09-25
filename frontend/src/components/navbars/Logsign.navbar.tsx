'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

export default function ButtonAppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isUser, setIsUser] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const getUserIdFromToken = (token: string | undefined | null) => {
    if (!token) return null;
    try {
      const [, payload] = token.split('.');
      if (!payload) return null;
      const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return json.userId || json.id || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    const userId = getUserIdFromToken(token);
    if (!token || !userId) {
      setIsUser(false);
      setAvatarUrl(undefined);
      return;
    }
    setIsUser(true);
    (async () => {
      try {
        const { data } = await axios.get<{ user: any }>(`http://localhost:4000/api/users/${userId}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = data.user || data;
        setAvatarUrl(user.profilePicture);
      } catch {
        setAvatarUrl(undefined);
      }
    })();
  }, []);

  const onOpenMenu = (e: React.MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget);
  const onCloseMenu = () => setMenuAnchor(null);
  const onMyAccount = () => { onCloseMenu(); router.push('/profile'); };
  const onLogout = () => {
    onCloseMenu();
    Cookies.remove('token');
    setIsUser(false);
    setAvatarUrl(undefined);
    router.push('/login');
  };

  const isLoginPage = pathname === '/login';
  const buttonLabel = isLoginPage ? 'Signup' : 'Login';
  const buttonRoute = isLoginPage ? '/signup' : '/login';

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => router.push("/dashboard")}
        >
          <MenuIcon />
        </IconButton>


          <Box sx={{ flexGrow: 1 }} />

          {isUser ? (
            <>
              <IconButton onClick={onOpenMenu} aria-label="Profile menu">
                <Avatar src={avatarUrl} alt="Profile" />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={onCloseMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={onMyAccount}>My account</MenuItem>
                <MenuItem onClick={onLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={() => router.push(buttonRoute)}>
              {buttonLabel}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
