import {
    TextField,
    Autocomplete,
    Box,
} from '@mui/material';

const Search = (props) => {

    const alertAsText = alert => `(${alert.country_code}) ${alert.country_name}`;

    const renderAutocompleteOption = (props, option) => {
        // Propagating props from the Autocomplete parent object
        // Using the rest operator to "pull out" a property (key, in this case)
        // key must be passed explicitly added and not within the ...props spread
        const { key, ...nonKeyProps } = props;

        return <Box key={key} {...nonKeyProps}>
            <>{alertAsText(option)}</>
        </Box>;
    }

    return (<>
        <Autocomplete
            options={props.alerts}
            autoHighlight
            getOptionKey={option => option.country_code}
            getOptionLabel={option => alertAsText(option)}
            renderOption={renderAutocompleteOption}
            renderInput={(props) => <TextField {...props} label="Find Alert" />}
            sx={{ marginTop: "0.5em" }}
            onChange={(_event, selectedOption) => {
                if (!props.onSelection) return;
                props.onSelection(selectedOption);
            }}
        />
    </>);
};

export default Search;