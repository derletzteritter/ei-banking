import { alpha, InputBase, styled } from "@mui/material";

export const SidebarWrapper = styled('div')({
	paddingTop: 20,
	background: '#2C3036',
	width: 300,
});

export const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: '#42464A',
	color: '#fff',
	marginRight: theme.spacing(2),
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 'auto',
	},
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 1),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 5),
		// vertical padding + font size from searchIcon
		transition: theme.transitions.create('width'),
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	},
}));