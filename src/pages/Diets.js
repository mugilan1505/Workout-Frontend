import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Container
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  LocalDining as DiningIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchDiets, 
  createDiet, 
  updateDiet, 
  deleteDiet,
  clearError 
} from '../redux/slices/dietSlice';

const Diets = () => {
  const dispatch = useDispatch();
  const { diets, loading, error } = useSelector((state) => state.diets);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const [openDialog, setOpenDialog] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingDiet, setEditingDiet] = useState(null);
  const [viewingDiet, setViewingDiet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    mealPlan: ''
  });

  useEffect(() => {
    dispatch(fetchDiets());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [error, dispatch]);

  const handleOpenDialog = (diet = null) => {
    if (diet) {
      setEditingDiet(diet);
      setFormData({
        name: diet.name,
        description: diet.description || '',
        calories: diet.calories || '',
        protein: diet.protein || '',
        carbs: diet.carbs || '',
        fats: diet.fats || '',
        mealPlan: diet.mealPlan || ''
      });
    } else {
      setEditingDiet(null);
      setFormData({ name: '', description: '', calories: '', protein: '', carbs: '', fats: '', mealPlan: '' });
    }
    setOpenDialog(true);
  };

  const handleViewPlan = (diet) => {
    // Ensure all fields are properly set, even if they're undefined in the diet object
    const dietWithDefaults = {
      ...diet,
      protein: diet.protein || '0',
      carbs: diet.carbs || '0',
      fats: diet.fats || '0',
      description: diet.description || 'No description available.',
      mealPlan: diet.mealPlan || 'No meal plan details available.'
    };
    setViewingDiet(dietWithDefaults);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setViewDialogOpen(false);
    setEditingDiet(null);
    setViewingDiet(null);
    setFormData({ name: '', description: '', calories: '', protein: '', carbs: '', fats: '' });
  };

  const handleSubmit = async () => {
    if (editingDiet) {
      await dispatch(updateDiet({ id: editingDiet.id, dietData: formData }));
    } else {
      await dispatch(createDiet(formData));
    }
    handleCloseDialog();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this diet plan?')) {
      await dispatch(deleteDiet(id));
    }
  };

  const getCalorieColor = (calories) => {
    const cal = parseInt(calories);
    if (cal < 1200) return '#27ae60';
    if (cal < 2000) return '#f7931e';
    return '#e74c3c';
  };

  const getCalorieLabel = (calories) => {
    const cal = parseInt(calories);
    if (cal < 1200) return 'Low Calorie';
    if (cal < 2000) return 'Moderate';
    return 'High Calorie';
  };

  if (loading) {
    return (
      <Box className="modern-home-container">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress sx={{ color: '#ff6b35' }} />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="modern-home-container">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h3" className="modern-title">
              Diet Plans
            </Typography>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                className="modern-button"
              >
                Add Diet Plan
              </Button>
            )}
          </Box>
          <Typography variant="body1" className="modern-text">
            Discover balanced nutrition plans tailored to your fitness goals
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="modern-card hover-lift">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <RestaurantIcon sx={{ fontSize: 48, color: '#ff6b35', mb: 2 }} />
                <Typography variant="h4" className="modern-title">
                  {diets.length}
                </Typography>
                <Typography variant="body2" className="modern-text">
                  Total Diet Plans
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="modern-card hover-lift">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <DiningIcon sx={{ fontSize: 48, color: '#27ae60', mb: 2 }} />
                <Typography variant="h4" className="modern-title">
                  {diets.filter(d => parseInt(d.calories) < 1200).length}
                </Typography>
                <Typography variant="body2" className="modern-text">
                  Low Calorie Plans
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="modern-card hover-lift">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 48, color: '#f7931e', mb: 2 }} />
                <Typography variant="h4" className="modern-title">
                  {diets.filter(d => parseInt(d.calories) >= 1200 && parseInt(d.calories) < 2000).length}
                </Typography>
                <Typography variant="body2" className="modern-text">
                  Moderate Plans
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="modern-card hover-lift">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <RestaurantIcon sx={{ fontSize: 48, color: '#e74c3c', mb: 2 }} />
                <Typography variant="h4" className="modern-title">
                  {diets.filter(d => parseInt(d.calories) >= 2000).length}
                </Typography>
                <Typography variant="body2" className="modern-text">
                  High Calorie Plans
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Diet Plans Grid */}
        <Grid container spacing={3}>
          {diets.length === 0 ? (
            <Grid item xs={12}>
              <Card className="modern-card">
                <CardContent sx={{ textAlign: 'center', p: 6 }}>
                  <RestaurantIcon sx={{ fontSize: 64, color: '#ff6b35', mb: 2 }} />
                  <Typography variant="h5" className="modern-title" gutterBottom>
                    No Diet Plans Available
                  </Typography>
                  <Typography variant="body1" className="modern-text" sx={{ mb: 3 }}>
                    {isAdmin 
                      ? 'Create your first diet plan to get started!' 
                      : 'No diet plans have been created yet. Check back soon!'}
                  </Typography>
                  {isAdmin && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog()}
                      className="modern-button"
                    >
                      Create First Diet Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ) : (
            diets.map((diet) => (
              <Grid item xs={12} sm={6} md={4} key={diet.id}>
                <Card className="modern-card hover-lift" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=200&fit=crop"
                    alt={diet.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography gutterBottom variant="h6" component="div" className="modern-title" sx={{ flexGrow: 1 }}>
                        {diet.name}
                      </Typography>
                      {isAdmin && (
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(diet)}
                            sx={{ color: '#ff6b35' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(diet.id)}
                            sx={{ color: '#e74c3c' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    
                    {diet.calories && (
                      <Chip
                        label={`${diet.calories} calories`}
                        sx={{
                          backgroundColor: getCalorieColor(diet.calories),
                          color: 'white',
                          mb: 2,
                          alignSelf: 'flex-start'
                        }}
                        size="small"
                      />
                    )}
                    
                    <Typography variant="body2" className="modern-text" sx={{ mb: 2, flexGrow: 1 }}>
                      {diet.description || 'No description available.'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {diet.protein && (
                        <Chip
                          label={`${diet.protein}g protein`}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: '#27ae60', color: '#27ae60' }}
                        />
                      )}
                      {diet.carbs && (
                        <Chip
                          label={`${diet.carbs}g carbs`}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: '#f7931e', color: '#f7931e' }}
                        />
                      )}
                      {diet.fats && (
                        <Chip
                          label={`${diet.fats}g fats`}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: '#e74c3c', color: '#e74c3c' }}
                        />
                      )}
                    </Box>
                    
                    <Button 
                      variant="contained" 
                      fullWidth 
                      startIcon={<ViewIcon />}
                      className="modern-button"
                      onClick={() => handleViewPlan(diet)}
                    >
                      View Plan
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle className="modern-title">
          {editingDiet ? 'Edit Diet Plan' : 'Add New Diet Plan'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Diet Plan Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="modern-input"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="modern-input"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Calories"
            fullWidth
            variant="outlined"
            type="number"
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
            className="modern-input"
            placeholder="e.g., 1500"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Protein (g)"
            fullWidth
            variant="outlined"
            type="number"
            value={formData.protein}
            onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
            className="modern-input"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Carbohydrates (g)"
            fullWidth
            variant="outlined"
            type="number"
            value={formData.carbs}
            onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
            className="modern-input"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Fats (g)"
            fullWidth
            variant="outlined"
            type="number"
            value={formData.fats}
            onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
            className="modern-input"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Meal Plan Details"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={formData.mealPlan}
            onChange={(e) => setFormData({ ...formData, mealPlan: e.target.value })}
            className="modern-input"
            placeholder="Enter detailed meal plan (breakfast, lunch, dinner, snacks, etc.)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#5a6c7d' }}>Cancel</Button>
          <Button onClick={handleSubmit} className="modern-button">
            {editingDiet ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Diet Plan Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle className="modern-title" sx={{ display: 'flex', alignItems: 'center' }}>
          <RestaurantIcon sx={{ mr: 1 }} />
          {viewingDiet?.name}
        </DialogTitle>
        <DialogContent>
          {viewingDiet && (
            <Box>
              {viewingDiet.calories && (
                <Box display="flex" alignItems="center" mb={3}>
                  <Box flexGrow={1}>
                    <Typography variant="subtitle1" className="modern-title" gutterBottom>
                      Nutritional Information
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                      <Chip
                        label={`${viewingDiet.calories} calories`}
                        sx={{
                          backgroundColor: getCalorieColor(viewingDiet.calories),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <Chip
                        label={`${viewingDiet.protein || 0}g protein`}
                        variant="outlined"
                        sx={{ borderColor: '#27ae60', color: '#27ae60' }}
                      />
                      <Chip
                        label={`${viewingDiet.carbs || 0}g carbs`}
                        variant="outlined"
                        sx={{ borderColor: '#f7931e', color: '#f7931e' }}
                      />
                      <Chip
                        label={`${viewingDiet.fats || 0}g fats`}
                        variant="outlined"
                        sx={{ borderColor: '#e74c3c', color: '#e74c3c' }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
              
              <Box>
                <Typography variant="subtitle1" className="modern-title" gutterBottom>
                  Description
                </Typography>
                <Box sx={{ 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: 2, 
                  p: 2,
                  mb: 3,
                  whiteSpace: 'pre-line'
                }}>
                  {viewingDiet.description}
                </Box>

                <Typography variant="subtitle1" className="modern-title" gutterBottom>
                  Meal Plan
                </Typography>
                <Box sx={{ 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: 2, 
                  p: 2,
                  whiteSpace: 'pre-line'
                }}>
                  {viewingDiet.mealPlan}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#5a6c7d' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Diets;
